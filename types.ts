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
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}
