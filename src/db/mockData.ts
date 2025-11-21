import { TermData } from '../types';

export function getMockTerms(): TermData[] {
  return [
    {
      id: 'mock-1',
      word: 'width',
      description: 'CSSの横幅プロパティ',
      options: [
        { id: 'opt-1-1', label: 'ウィドス', count: 120, isCustom: false },
        { id: 'opt-1-2', label: 'ワイド', count: 85, isCustom: false },
        { id: 'opt-1-3', label: 'ウィズ', count: 45, isCustom: false },
      ],
      totalVotes: 250,
    },
    {
      id: 'mock-2',
      word: 'Kubernetes',
      description: 'コンテナオーケストレーションプラットフォーム',
      options: [
        { id: 'opt-2-1', label: 'クーベネティス', count: 200, isCustom: false },
        { id: 'opt-2-2', label: 'クバネティス', count: 150, isCustom: false },
        { id: 'opt-2-3', label: 'ケーエイト', count: 95, isCustom: false },
      ],
      totalVotes: 445,
    },
    {
      id: 'mock-3',
      word: 'App',
      description: 'アプリケーション',
      options: [
        { id: 'opt-3-1', label: 'アップ', count: 180, isCustom: false },
        { id: 'opt-3-2', label: 'アプ', count: 100, isCustom: false },
      ],
      totalVotes: 280,
    },
  ];
}
