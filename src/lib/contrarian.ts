import { TermData } from '../types';

export interface Pick {
  termId: string;
  optionId?: string; // 既定の選択肢を選んだ場合
  label?: string; // カスタム読みを入れた場合
}

export interface ContrarianBreakdownRow {
  word: string;
  pickLabel: string;
  pct: number; // その読みの全体シェア（%）
  isMinority: boolean; // 1位の読みでなければ true
}

export interface ContrarianResult {
  score: number; // 逆張り度 0-100（高いほど少数派の読みを選んでいる）
  total: number; // 集計対象の投票数
  minorityCount: number; // 少数派だった回数
  title: string; // 称号
  sub: string; // 称号の補足
  rows: ContrarianBreakdownRow[]; // 少数派だった単語（少数派度が高い順）
}

function titleFor(score: number): { title: string; sub: string } {
  if (score >= 70) return { title: '逆張りの達人', sub: '少数派こそ我が道。' };
  if (score >= 50) return { title: '我が道を行くタイプ', sub: '多数決には流されない。' };
  if (score >= 30) return { title: 'バランス派', sub: '長いものに巻かれたり巻かれなかったり。' };
  return { title: '多数派の安心感', sub: 'みんなと同じが一番ッスね。' };
}

/**
 * セッション中の自分の投票（picks）を、現在の集計（terms）と突き合わせて逆張り度を出す。
 * 「自分の1票」は除外して、"周りの何%が自分と違う読みか" を測る。
 */
export function computeContrarian(picks: Pick[], terms: TermData[]): ContrarianResult {
  const termMap = new Map(terms.map((t) => [t.id, t]));
  // 同じ単語に複数回投票していたら最後の1票を採用
  const latest = new Map<string, Pick>();
  for (const p of picks) latest.set(p.termId, p);

  const rows: ContrarianBreakdownRow[] = [];
  let scoreSum = 0;
  let counted = 0;
  let minorityCount = 0;

  for (const pick of latest.values()) {
    const term = termMap.get(pick.termId);
    if (!term) continue;
    const opt = pick.optionId
      ? term.options.find((o) => o.id === pick.optionId)
      : term.options.find((o) => o.label.toLowerCase() === (pick.label ?? '').toLowerCase());
    if (!opt) continue;

    const total = term.totalVotes;
    const pct = total > 0 ? Math.round((opt.count / total) * 100) : 0;
    // 自分の1票を除外したシェア（周りの賛同率）
    const shareExclSelf = total > 1 ? (opt.count - 1) / (total - 1) : 0;
    const contrarian = 1 - shareExclSelf;
    // 自票を除外して順位判定する（自分が入れて初めて並んだ/逆転したケースを
    // 「少数派ではない」と誤判定しないため）。自分の選んだ option だけ -1 して比較。
    const adj = (o: { id: string; count: number }) => o.count - (o.id === opt.id ? 1 : 0);
    const topCount = Math.max(...term.options.map(adj));
    const isMinority = adj(opt) < topCount;

    scoreSum += contrarian;
    counted += 1;
    if (isMinority) minorityCount += 1;
    rows.push({ word: term.word, pickLabel: opt.label, pct, isMinority });
  }

  const score = counted > 0 ? Math.round((scoreSum / counted) * 100) : 0;
  const { title, sub } = titleFor(score);
  rows.sort((a, b) => Number(b.isMinority) - Number(a.isMinority) || a.pct - b.pct);

  return { score, total: counted, minorityCount, title, sub, rows };
}
