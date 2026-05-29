import { drizzle } from 'drizzle-orm/d1';
import { eq, sql, desc, and, inArray } from 'drizzle-orm';
import { terms, options, segmentCounts, termsRelations, optionsRelations } from './schema';
import { TermData } from '../types';
import {
  sanitizeSegment,
  type UserSegment,
  type Dim,
  type SegmentBreakdown,
} from '../lib/segments';
import { getContext } from 'hono/context-storage';
import { getMockTerms } from './mockData';

const schema = { terms, options, termsRelations, optionsRelations };

/**
 * Cloudflare の D1 バインディング (DB) を Drizzle でラップして返す。
 * バインディングが取得できない場合は null（呼び出し側が dev フォールバックを判断する）。
 */
function getDB() {
  try {
    const c = getContext();
    // @ts-ignore Cloudflare バインディングは hono の型に載っていない
    const db = c?.env?.DB;
    if (!db) return null;
    return drizzle(db, { schema });
  } catch {
    return null;
  }
}

// --- 開発時 (waku dev など D1 が無い環境) 専用の in-memory フォールバック ---------
// 本番 (wrangler dev / Cloudflare) は import.meta.env.PROD なのでフォールバックしない。
// = D1 が必須であり、欠落時はエラーにして握りつぶさない。
const isDev = !!import.meta.env?.DEV;

let mockStore: TermData[] | null = null;
function getMockStore(): TermData[] {
  if (!mockStore) mockStore = getMockTerms();
  return mockStore;
}

function noDb(): never {
  throw new Error(
    'D1 Database binding (DB) not found. wrangler.jsonc を確認し、`npm run dev:cf`（wrangler dev）で起動するか、`npm run dev`（waku dev）を使ってください。',
  );
}

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function getTerms(): Promise<TermData[]> {
  const db = getDB();

  if (!db) {
    if (isDev) return structuredClone(getMockStore());
    noDb();
  }

  const result = await db.query.terms.findMany({
    orderBy: [desc(terms.createdAt)],
    with: { options: true },
  });

  return result.map((term) => ({
    id: term.id,
    word: term.word,
    description: term.description,
    options: term.options.map((opt) => ({
      id: opt.id,
      label: opt.label,
      count: opt.count,
      isCustom: opt.isCustom,
    })),
    totalVotes: term.options.reduce((acc, curr) => acc + curr.count, 0),
  }));
}

export async function getTermById(id: string): Promise<TermData | null> {
  const db = getDB();

  if (!db) {
    if (isDev) return structuredClone(getMockStore().find((t) => t.id === id) ?? null);
    noDb();
  }

  const term = await db.query.terms.findFirst({
    where: (terms, { eq }) => eq(terms.id, id),
    with: { options: true },
  });
  if (!term) return null;

  return {
    id: term.id,
    word: term.word,
    description: term.description,
    options: term.options.map((opt) => ({
      id: opt.id,
      label: opt.label,
      count: opt.count,
      isCustom: opt.isCustom,
    })),
    totalVotes: term.options.reduce((acc, curr) => acc + curr.count, 0),
  };
}

export async function updateVote(
  termId: string,
  optionId: string,
  customLabel?: string,
  segment?: UserSegment,
): Promise<TermData[]> {
  const db = getDB();

  if (!db) {
    if (isDev) return mockVote(termId, optionId, customLabel, segment);
    noDb();
  }

  let votedOptionId = optionId;

  if (optionId === 'custom' && customLabel) {
    // 同じカスタム読み（大文字小文字無視）が既にあれば加算、無ければ追加
    const existing = await db.query.options.findFirst({
      where: (options, { and, eq, sql }) =>
        and(eq(options.termId, termId), sql`lower(${options.label}) = lower(${customLabel})`),
    });

    if (existing) {
      votedOptionId = existing.id;
      await db
        .update(options)
        .set({ count: sql`${options.count} + 1` })
        .where(eq(options.id, existing.id));
    } else {
      votedOptionId = newId('custom');
      await db.insert(options).values({
        id: votedOptionId,
        termId,
        label: customLabel,
        count: 1,
        isCustom: true,
      });
    }
  } else {
    // optionId が本当に termId 配下の選択肢か検証する。
    // （改ざんで別用語の option を増やす・存在しないIDで0件更新→孤立した segment_counts 加算 を防ぐ）
    const opt = await db.query.options.findFirst({
      where: (options, { and, eq }) => and(eq(options.id, optionId), eq(options.termId, termId)),
    });
    if (!opt) throw new Error('Invalid option for term');
    await db
      .update(options)
      .set({ count: sql`${options.count} + 1` })
      .where(eq(options.id, opt.id));
    votedOptionId = opt.id;
  }

  await bumpSegments(votedOptionId, segment);
  return getTerms();
}

// セグメント別カウンタを加算（職種 / 経験年数。指定があるものだけ）。
// セグメント加算はあくまで付随情報なので、失敗しても投票自体は成功扱いにする（best-effort）。
// ＝ ここで throw すると count は増えているのに「投票失敗」と表示され、再試行で二重投票になるため。
async function bumpSegments(optionId: string, segment?: UserSegment) {
  const db = getDB();
  if (!db) return;
  const seg = sanitizeSegment(segment);
  const entries: Array<[Dim, string]> = [];
  if (seg.role) entries.push(['role', seg.role]);
  if (seg.exp) entries.push(['exp', seg.exp]);
  if (entries.length === 0) return;
  try {
    for (const [dim, bucket] of entries) {
      await db
        .insert(segmentCounts)
        .values({ optionId, dim, bucket, count: 1 })
        .onConflictDoUpdate({
          target: [segmentCounts.optionId, segmentCounts.dim, segmentCounts.bucket],
          set: { count: sql`${segmentCounts.count} + 1` },
        });
    }
  } catch (e) {
    console.error('segment bump failed (non-fatal):', e);
  }
}

/** ある用語の、ユーザーの職種/経験年数セグメントでの読み方分布を返す */
export async function getSegmentBreakdown(
  termId: string,
  role?: string,
  exp?: string,
): Promise<SegmentBreakdown> {
  const seg = sanitizeSegment({ role, exp });
  const db = getDB();

  if (!db) {
    if (isDev) return mockBreakdown(termId, seg);
    noDb();
  }

  const optRows = await db
    .select({ id: options.id })
    .from(options)
    .where(eq(options.termId, termId));
  const ids = optRows.map((o) => o.id);
  const result: SegmentBreakdown = {};
  if (ids.length === 0) return result;

  const dims: Array<[Dim, string | undefined]> = [
    ['role', seg.role],
    ['exp', seg.exp],
  ];
  for (const [dim, bucket] of dims) {
    if (!bucket) continue;
    const rows = await db
      .select({ optionId: segmentCounts.optionId, count: segmentCounts.count })
      .from(segmentCounts)
      .where(
        and(
          inArray(segmentCounts.optionId, ids),
          eq(segmentCounts.dim, dim),
          eq(segmentCounts.bucket, bucket),
        ),
      );
    const total = rows.reduce((s, r) => s + r.count, 0);
    result[dim] = { bucket, rows, total };
  }
  return result;
}

/**
 * 新しい用語と読み方候補を登録する。labels は trim/重複排除済みを想定。
 * 作成した TermData を返す。
 */
export async function addTerm(
  word: string,
  description: string,
  labels: string[],
): Promise<TermData> {
  const db = getDB();

  if (!db) {
    if (isDev) return mockAddTerm(word, description, labels);
    noDb();
  }

  const id = newId('term');
  const createdAt = Date.now();
  const optionRows = labels.map((label, i) => ({
    id: `${id}-opt-${i}`,
    termId: id,
    label,
    count: 0,
    isCustom: false,
  }));

  // D1 はインタラクティブなトランザクション非対応のため batch で原子的に実行する。
  // （term だけ入って options が入らない「孤立 term」を防ぐ）
  await db.batch([
    db.insert(terms).values({ id, word, description, createdAt }),
    db.insert(options).values(optionRows),
  ]);

  return {
    id,
    word,
    description,
    options: optionRows.map(({ id, label, count, isCustom }) => ({ id, label, count, isCustom })),
    totalVotes: 0,
  };
}

// --- in-memory フォールバックの実装 (dev のみ) -------------------------------------
function hashUnit(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000; // 0..1
}

// dev用: 集計のシェアを決定論的に摂動してセグメント分布を捏造する（本番は実データ）
function mockBreakdown(termId: string, seg: UserSegment): SegmentBreakdown {
  const term = getMockStore().find((t) => t.id === termId);
  const result: SegmentBreakdown = {};
  if (!term || term.totalVotes === 0) return result;
  const total = term.totalVotes;
  const build = (dim: Dim, bucket: string) => {
    const baseN = 64;
    const weights = term.options.map((o) =>
      Math.max((o.count / total) * (1 + (hashUnit(`${o.id}|${dim}|${bucket}`) * 1.2 - 0.6)), 0.0001),
    );
    const wsum = weights.reduce((a, b) => a + b, 0);
    const rows = term.options.map((o, i) => ({ optionId: o.id, count: Math.round((baseN * weights[i]) / wsum) }));
    return { bucket, rows, total: rows.reduce((s, r) => s + r.count, 0) };
  };
  if (seg.role) result.role = build('role', seg.role);
  if (seg.exp) result.exp = build('exp', seg.exp);
  return result;
}

function mockVote(
  termId: string,
  optionId: string,
  customLabel?: string,
  _segment?: UserSegment,
): TermData[] {
  const store = getMockStore();
  const term = store.find((t) => t.id === termId);
  if (term) {
    if (optionId === 'custom' && customLabel) {
      const existing = term.options.find(
        (o) => o.label.toLowerCase() === customLabel.toLowerCase(),
      );
      if (existing) {
        existing.count += 1;
      } else {
        term.options.push({ id: newId('custom'), label: customLabel, count: 1, isCustom: true });
      }
    } else {
      const opt = term.options.find((o) => o.id === optionId);
      if (opt) opt.count += 1;
    }
    term.totalVotes = term.options.reduce((acc, o) => acc + o.count, 0);
  }
  return structuredClone(store);
}

function mockAddTerm(word: string, description: string, labels: string[]): TermData {
  const store = getMockStore();
  const id = newId('term');
  const newTerm: TermData = {
    id,
    word,
    description,
    options: labels.map((label, i) => ({
      id: `${id}-opt-${i}`,
      label,
      count: 0,
      isCustom: false,
    })),
    totalVotes: 0,
  };
  store.unshift(newTerm); // 新しい順なので先頭に追加
  return structuredClone(newTerm);
}
