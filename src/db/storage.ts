import { drizzle } from 'drizzle-orm/d1';
import { eq, sql, desc } from 'drizzle-orm';
import { terms, options, termsRelations, optionsRelations } from './schema';
import { TermData } from '../types';

// Helper to access the D1 binding
const getDB = () => {
  const schema = { terms, options, termsRelations, optionsRelations };
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env.DB) {
     // @ts-ignore
     return drizzle(process.env.DB, { schema });
  }
  // @ts-ignore
  if (typeof globalThis !== 'undefined' && (globalThis as any).DB) {
     // @ts-ignore
     return drizzle((globalThis as any).DB, { schema });
  }
  // @ts-ignore
  if (typeof globalThis !== 'undefined' && (globalThis as any).env && (globalThis as any).env.DB) {
     // @ts-ignore
     return drizzle((globalThis as any).env.DB, { schema });
  }
  throw new Error('D1 Database binding (DB) not found. Please check your wrangler.toml and environment variables.');
};

export async function getTerms(): Promise<TermData[]> {
  try {
    const db = getDB();
    
    const result = await db.query.terms.findMany({
      orderBy: [desc(terms.createdAt)],
      with: {
        options: true
      }
    });

    return result.map(term => {
      const totalVotes = term.options.reduce((acc, curr) => acc + curr.count, 0);
      return {
        id: term.id,
        word: term.word,
        description: term.description,
        options: term.options.map(opt => ({
          id: opt.id,
          label: opt.label,
          count: opt.count,
          isCustom: opt.isCustom
        })),
        totalVotes
      };
    });
  } catch (e) {
    console.error('Error reading from D1:', e);
    return [];
  }
}

export async function updateVote(termId: string, optionId: string, customLabel?: string): Promise<TermData[]> {
  const db = getDB();

  if (optionId === 'custom' && customLabel) {
    // Check for existing custom option (case-insensitive)
    const existing = await db.query.options.findFirst({
      where: (options, { and, eq, sql }) => and(
        eq(options.termId, termId),
        sql`lower(${options.label}) = lower(${customLabel})`
      )
    });

    if (existing) {
      await db.update(options)
        .set({ count: sql`${options.count} + 1` })
        .where(eq(options.id, existing.id));
    } else {
      const newId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await db.insert(options).values({
        id: newId,
        termId: termId,
        label: customLabel,
        count: 1,
        isCustom: true
      });
    }
  } else {
    await db.update(options)
      .set({ count: sql`${options.count} + 1` })
      .where(eq(options.id, optionId));
  }

  return getTerms();
}