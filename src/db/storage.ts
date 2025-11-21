import { TermData } from '../types';

// D1 Type Definitions
interface D1Database {
  prepare: (query: string) => D1PreparedStatement;
  batch: (statements: D1PreparedStatement[]) => Promise<D1Result[]>;
  exec: (query: string) => Promise<D1ExecResult>;
}

interface D1PreparedStatement {
  bind: (...args: any[]) => D1PreparedStatement;
  first: <T = unknown>(colName?: string) => Promise<T | null>;
  run: <T = unknown>() => Promise<D1Result<T>>;
  all: <T = unknown>() => Promise<D1Result<T>>;
}

interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  error?: string;
  meta: any;
}

interface D1ExecResult {
  count: number;
  duration: number;
}

// In-memory fallback storage for environments without D1 (e.g. AI Studio Preview)
// Using globalThis to persist across module reloads if possible
const globalStore = globalThis as any;
if (!globalStore.__mockTerms) globalStore.__mockTerms = [];
if (!globalStore.__mockOptions) globalStore.__mockOptions = [];

function getMockData() {
  return {
    terms: globalStore.__mockTerms as any[],
    options: globalStore.__mockOptions as any[]
  };
}

// Helper to access the D1 binding
const getDB = (): D1Database | null => {
  // In Cloudflare Workers with Node compatibility or standard binding
  // the binding is often available on process.env or globalThis
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env.DB) {
     // @ts-ignore
     return process.env.DB as D1Database;
  }
  // @ts-ignore
  if (typeof globalThis !== 'undefined' && (globalThis as any).DB) {
     // @ts-ignore
     return (globalThis as any).DB as D1Database;
  }
  
  console.warn('D1 Database binding (DB) not found. Using in-memory fallback for preview.');
  return null;
};

// Ensure tables exist
async function ensureSchema(db: D1Database) {
  const sql = `
    CREATE TABLE IF NOT EXISTS terms (
      id TEXT PRIMARY KEY,
      word TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS options (
      id TEXT PRIMARY KEY,
      term_id TEXT NOT NULL,
      label TEXT NOT NULL,
      count INTEGER DEFAULT 0,
      is_custom BOOLEAN DEFAULT 0,
      FOREIGN KEY (term_id) REFERENCES terms(id)
    );
  `;
  await db.exec(sql);
}

export async function getTerms(): Promise<TermData[]> {
  const db = getDB();

  if (!db) {
    // Fallback: Get from memory
    const { terms, options } = getMockData();
    if (terms.length === 0) return [];

    return terms.map(term => {
      const termOptions = options
        .filter(o => o.term_id === term.id)
        .map(o => ({
          id: o.id,
          label: o.label,
          count: o.count,
          isCustom: Boolean(o.is_custom)
        }));

      const totalVotes = termOptions.reduce((acc: number, curr: any) => acc + curr.count, 0);

      return {
        id: term.id,
        word: term.word,
        description: term.description,
        options: termOptions,
        totalVotes
      };
    }).sort((a, b) => (b as any).created_at - (a as any).created_at);
  }

  await ensureSchema(db);

  try {
    const termsResult = await db.prepare('SELECT * FROM terms ORDER BY created_at DESC').all<any>();
    const terms = termsResult.results || [];

    if (terms.length === 0) {
      return [];
    }

    const optionsResult = await db.prepare('SELECT * FROM options').all<any>();
    const allOptions = optionsResult.results || [];

    return terms.map(term => {
      const termOptions = allOptions
        .filter(o => o.term_id === term.id)
        .map(o => ({
          id: o.id,
          label: o.label,
          count: o.count,
          isCustom: Boolean(o.is_custom)
        }));

      const totalVotes = termOptions.reduce((acc, curr) => acc + curr.count, 0);

      return {
        id: term.id,
        word: term.word,
        description: term.description,
        options: termOptions,
        totalVotes
      };
    });

  } catch (e) {
    console.error('Error reading from D1:', e);
    return [];
  }
}

export async function saveTerms(terms: TermData[]): Promise<void> {
  const db = getDB();

  if (!db) {
    // Fallback: Save to memory
    const { terms: mTerms, options: mOptions } = getMockData();
    for (const term of terms) {
      // Check if exists
      if (!mTerms.find(t => t.id === term.id)) {
        mTerms.push({
          id: term.id,
          word: term.word,
          description: term.description,
          created_at: Date.now()
        });
        
        for (const opt of term.options) {
          mOptions.push({
            id: opt.id,
            term_id: term.id,
            label: opt.label,
            count: opt.count,
            is_custom: opt.isCustom
          });
        }
      }
    }
    return;
  }

  await ensureSchema(db);

  const statements: D1PreparedStatement[] = [];

  for (const term of terms) {
    statements.push(
      db.prepare('INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES (?, ?, ?, ?)')
        .bind(term.id, term.word, term.description, Date.now())
    );

    for (const option of term.options) {
      statements.push(
        db.prepare('INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES (?, ?, ?, ?, ?)')
          .bind(option.id, term.id, option.label, option.count, option.isCustom ? 1 : 0)
      );
    }
  }

  if (statements.length > 0) {
    await db.batch(statements);
  }
}

export async function updateVote(termId: string, optionId: string, customLabel?: string): Promise<TermData[]> {
  const db = getDB();

  if (!db) {
    // Fallback: Update memory
    const { options: mOptions } = getMockData();
    
    if (optionId === 'custom' && customLabel) {
      // Check existing custom
      const existing = mOptions.find(o => o.term_id === termId && o.label.toLowerCase() === customLabel.toLowerCase());
      if (existing) {
        existing.count++;
      } else {
        mOptions.push({
          id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          term_id: termId,
          label: customLabel,
          count: 1,
          is_custom: true
        });
      }
    } else {
      const target = mOptions.find(o => o.id === optionId);
      if (target) {
        target.count++;
      }
    }
    return getTerms();
  }

  await ensureSchema(db);

  if (optionId === 'custom' && customLabel) {
    // Check for existing custom option (case-insensitive)
    const existing = await db.prepare('SELECT * FROM options WHERE term_id = ? AND lower(label) = lower(?)')
      .bind(termId, customLabel)
      .first<any>();

    if (existing) {
      await db.prepare('UPDATE options SET count = count + 1 WHERE id = ?')
        .bind(existing.id)
        .run();
    } else {
      const newId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await db.prepare('INSERT INTO options (id, term_id, label, count, is_custom) VALUES (?, ?, ?, 1, 1)')
        .bind(newId, termId, customLabel)
        .run();
    }
  } else {
    await db.prepare('UPDATE options SET count = count + 1 WHERE id = ?')
      .bind(optionId)
      .run();
  }

  return getTerms();
}