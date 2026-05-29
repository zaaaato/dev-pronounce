export interface PronunciationOption {
  id: string;
  label: string;
  count: number;
  isCustom?: boolean;
}

export interface TermData {
  id: string;
  word: string;
  description: string;
  options: PronunciationOption[];
  totalVotes: number;
}

export enum AppState {
  LOADING = 'LOADING',
  VOTING = 'VOTING',
  ERROR = 'ERROR'
}

// 新規用語登録の入力上限。クライアント検証とサーバ側バックストップで共有する。
// （'use server' なファイルからは定数を export できないためここに置く）
export const TERM_LIMITS = {
  word: 40,
  description: 80,
  label: 24,
  minOptions: 2,
  maxOptions: 6,
} as const;

// ランキングで「割れ度」を判定する最低票数。これ未満は「判定中」枠に隔離して
// 新規用語の偶発的な1位を防ぐ。
export const RANKING_MIN_VOTES = 30;