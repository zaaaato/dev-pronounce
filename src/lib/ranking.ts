import { TermData, RANKING_MIN_VOTES } from '../types';

export interface RankedTerm {
  term: TermData;
  score: number | null; // 0-100 割れ度。判定中は null
  top1: { label: string; pct: number } | null;
  top2: { label: string; pct: number } | null;
  total: number;
  judging: boolean;
}

/**
 * 割れ度スコア = 上位2読みの接戦度 × 票数信頼度（0-100）。
 *  - 接戦度: 1 - |p1-p2|/(p1+p2)  → 50/50で最大、一強で0
 *  - 対立の広がり: 1 - p1 を少し加味（3択以上の混戦も評価）
 *  - 信頼度: min(1, total/50) で少数票の暴れを抑える
 * 正規化エントロピー(log n)を使わない理由: 選択肢数nが多い用語やカスタム読みで
 * 分母が膨らみ、看板の2強対決（width, async）が不当に埋もれるため。
 */
export function scoreTerm(t: TermData): RankedTerm {
  const live = t.options.filter((o) => o.count > 0).sort((a, b) => b.count - a.count);
  const total = t.totalVotes;
  const top1 = live[0] ? { label: live[0].label, pct: Math.round((live[0].count / total) * 100) } : null;
  const top2 = live[1] ? { label: live[1].label, pct: Math.round((live[1].count / total) * 100) } : null;

  if (total < RANKING_MIN_VOTES || live.length < 2) {
    return { term: t, score: null, top1, top2, total, judging: true };
  }

  const p1 = live[0].count / total;
  const p2 = live[1].count / total;
  const closeness = 1 - Math.abs(p1 - p2) / (p1 + p2);
  const contested = 1 - p1;
  const confidence = Math.min(1, total / 50);
  const score = Math.round((0.7 * closeness + 0.3 * contested) * confidence * 100);

  return { term: t, score, top1, top2, total, judging: false };
}

// 決定的なタイブレーク: スコア → 票数 → 単語名（配列順やcreatedAtには依存しない）
function byScore(a: RankedTerm, b: RankedTerm) {
  return (b.score! - a.score!) || (b.total - a.total) || a.term.word.localeCompare(b.term.word);
}
function byConsensus(a: RankedTerm, b: RankedTerm) {
  return (
    (b.top1?.pct ?? 0) - (a.top1?.pct ?? 0) || b.total - a.total || a.term.word.localeCompare(b.term.word)
  );
}

export function computeRanking(terms: TermData[]) {
  const scored = terms.map(scoreTerm);
  const judged = scored.filter((s) => !s.judging);
  return {
    ranked: [...judged].sort(byScore), // 論争（割れ度高い順）
    consensus: [...judged].sort(byConsensus), // 満場一致（一強の順）
    judging: scored.filter((s) => s.judging).sort((a, b) => b.total - a.total),
  };
}
