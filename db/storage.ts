import { TermData, PronunciationOption } from '../types';

// Cloudflare D1 Type Definitions
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

// データベース接続の取得
// Cloudflare Workers環境では `env.DB` または `globalThis.DB` としてバインディングされる想定
const getDB = (): D1Database => {
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
  throw new Error('D1 Database binding (DB) not found. Please check your wrangler.toml and environment variables.');
};

// スキーマ初期化
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

// 全データの読み込み
export async function getTerms(): Promise<TermData[]> {
  const db = getDB();
  await ensureSchema(db);

  try {
    const termsResult = await db.prepare('SELECT * FROM terms ORDER BY created_at DESC').all<any>();
    const terms = termsResult.results;

    if (!terms || terms.length === 0) {
      return [];
    }

    // 各Termに対応するOptionsを取得
    // N+1問題回避のため、IDリストで一括取得するか、すべて取得してメモリで結合
    // 今回はデータ量が少ないので全てのOptionsを取得してマッピング
    const optionsResult = await db.prepare('SELECT * FROM options').all<any>();
    const allOptions = optionsResult.results;

    return terms.map(term => {
      const termOptions = allOptions.filter(o => o.term_id === term.id).map(o => ({
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
    console.error('Error reading D1:', e);
    return [];
  }
}

// データの保存（初期データ生成時）
export async function saveTerms(terms: TermData[]): Promise<void> {
  const db = getDB();
  await ensureSchema(db);

  // バッチ処理用のステートメント作成
  const statements: D1PreparedStatement[] = [];

  // 既存データをクリアするかどうかは要件次第だが、
  // ここでは「初期生成」の文脈で呼ばれるため、一度空でない場合は追加しない、もしくは
  // 上書きロジックが必要。ここでは単純化のため、ID重複チェックはD1の制約に任せるか、
  // 全く新しいデータとしてINSERTする。
  
  for (const term of terms) {
    // Termの挿入
    statements.push(
      db.prepare('INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES (?, ?, ?, ?)')
        .bind(term.id, term.word, term.description, Date.now())
    );

    for (const option of term.options) {
      // Optionの挿入
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

// 投票の更新処理
export async function updateVote(termId: string, optionId: string, customLabel?: string): Promise<TermData[]> {
  const db = getDB();
  await ensureSchema(db);

  if (optionId === 'custom' && customLabel) {
    // カスタム投票の処理
    
    // 1. 既存の同じラベルがあるかチェック（大文字小文字無視）
    const existing = await db.prepare('SELECT * FROM options WHERE term_id = ? AND lower(label) = lower(?)')
      .bind(termId, customLabel)
      .first<any>();

    if (existing) {
      // 既存があればカウントアップ
      await db.prepare('UPDATE options SET count = count + 1 WHERE id = ?')
        .bind(existing.id)
        .run();
    } else {
      // 新規作成
      const newId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await db.prepare('INSERT INTO options (id, term_id, label, count, is_custom) VALUES (?, ?, ?, 1, 1)')
        .bind(newId, termId, customLabel)
        .run();
    }
  } else {
    // 通常の投票：カウントアップ
    await db.prepare('UPDATE options SET count = count + 1 WHERE id = ?')
      .bind(optionId)
      .run();
  }

  // 更新後のデータを返却
  return getTerms();
}
