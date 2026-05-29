import { TermData } from '../types';

/**
 * 開発時（`waku dev`／Cloudflare バインディングが無い環境）に使うサンプルデータ。
 * db/seed.sql から自動生成（createdAt 降順）。seed を編集したら再生成して同期すること。
 * storage.ts がこれを起点に in-memory ストアを組み立てる（dev のみ）。
 */
export function getMockTerms(): TermData[] {
  const raw: Array<Omit<TermData, 'totalVotes'>> = [
    {
      id: 'term-9',
      word: 'nginx',
      description: 'Webサーバー / リバースプロキシ',
      options: [
        { id: 'opt-9-1', label: 'エンジンエックス', count: 240, isCustom: false },
        { id: 'opt-9-2', label: 'エヌジンクス', count: 70, isCustom: false },
        { id: 'opt-9-3', label: 'ンギンクス', count: 70, isCustom: false },
      ],
    },
    {
      id: 'term-8',
      word: 'GIF',
      description: '画像フォーマット',
      options: [
        { id: 'opt-8-1', label: 'ギフ', count: 260, isCustom: false },
        { id: 'opt-8-2', label: 'ジフ', count: 110, isCustom: false },
      ],
    },
    {
      id: 'term-7',
      word: 'char',
      description: '文字を表すデータ型',
      options: [
        { id: 'opt-7-1', label: 'チャー', count: 140, isCustom: false },
        { id: 'opt-7-2', label: 'キャラ', count: 90, isCustom: false },
      ],
    },
    {
      id: 'term-6',
      word: 'SQL',
      description: 'リレーショナルDBの問い合わせ言語',
      options: [
        { id: 'opt-6-1', label: 'エスキューエル', count: 220, isCustom: false },
        { id: 'opt-6-2', label: 'シークェル', count: 130, isCustom: false },
      ],
    },
    {
      id: 'term-4',
      word: 'null',
      description: 'データを持たない値やオブジェクト',
      options: [
        { id: 'opt-4-1', label: 'ヌル', count: 300, isCustom: false },
        { id: 'opt-4-2', label: 'ナル', count: 50, isCustom: false },
      ],
    },
    {
      id: 'term-2',
      word: 'Kubernetes',
      description: 'コンテナオーケストレーションプラットフォーム',
      options: [
        { id: 'opt-2-1', label: 'クーベネティス', count: 200, isCustom: false },
        { id: 'opt-2-2', label: 'クバネティス', count: 150, isCustom: false },
        { id: 'opt-2-3', label: 'ケーエイツ', count: 95, isCustom: false },
      ],
    },
    {
      id: 'term-1',
      word: 'width',
      description: 'CSSの横幅プロパティ',
      options: [
        { id: 'opt-1-1', label: 'ウィドス', count: 120, isCustom: false },
        { id: 'opt-1-2', label: 'ワイド', count: 85, isCustom: false },
        { id: 'opt-1-3', label: 'ワイズ', count: 45, isCustom: false },
      ],
    },
    {
      id: 'term-11',
      word: 'async',
      description: '非同期',
      options: [
        { id: 'opt-11-1', label: 'アシンク', count: 259, isCustom: false },
        { id: 'opt-11-2', label: 'エイシンク', count: 316, isCustom: false },
      ],
    },
    {
      id: 'term-12',
      word: 'sudo',
      description: '管理者権限実行',
      options: [
        { id: 'opt-12-2', label: 'スードゥー', count: 96, isCustom: false },
        { id: 'opt-12-3', label: 'スドー', count: 59, isCustom: false },
        { id: 'opt-12-4', label: 'スドゥ', count: 33, isCustom: false },
      ],
    },
    {
      id: 'term-13',
      word: 'varchar',
      description: '可変長文字列型',
      options: [
        { id: 'opt-13-1', label: 'バーチャー', count: 183, isCustom: false },
        { id: 'opt-13-2', label: 'バーキャラ', count: 270, isCustom: false },
      ],
    },
    {
      id: 'term-14',
      word: 'kubectl',
      description: 'k8s操作CLI',
      options: [
        { id: 'opt-14-1', label: 'キューブコントロール', count: 87, isCustom: false },
        { id: 'opt-14-2', label: 'キューブシーティーエル', count: 95, isCustom: false },
        { id: 'opt-14-3', label: 'クーブコントロール', count: 275, isCustom: false },
        { id: 'opt-14-4', label: 'クベシーティーエル', count: 178, isCustom: false },
      ],
    },
    {
      id: 'term-15',
      word: 'chmod',
      description: '権限変更コマンド',
      options: [
        { id: 'opt-15-1', label: 'シーエイチモッド', count: 274, isCustom: false },
        { id: 'opt-15-2', label: 'チェンジモッド', count: 54, isCustom: false },
        { id: 'opt-15-3', label: 'チモッド', count: 200, isCustom: false },
        { id: 'opt-15-4', label: 'チェンジモード', count: 149, isCustom: false },
      ],
    },
    {
      id: 'term-16',
      word: 'LaTeX',
      description: '組版システム',
      options: [
        { id: 'opt-16-1', label: 'ラテフ', count: 15, isCustom: false },
        { id: 'opt-16-2', label: 'ラテック', count: 77, isCustom: false },
        { id: 'opt-16-3', label: 'ラテックス', count: 265, isCustom: false },
      ],
    },
    {
      id: 'term-17',
      word: 'JWT',
      description: '認証用トークン',
      options: [
        { id: 'opt-17-1', label: 'ジェイダブリューティー', count: 210, isCustom: false },
        { id: 'opt-17-2', label: 'ジョット', count: 240, isCustom: false },
      ],
    },
    {
      id: 'term-18',
      word: '# (hash)',
      description: 'ハッシュ記号',
      options: [
        { id: 'opt-18-1', label: 'シャープ', count: 314, isCustom: false },
        { id: 'opt-18-2', label: 'ハッシュ', count: 41, isCustom: false },
      ],
    },
    {
      id: 'term-19',
      word: 'pseudo',
      description: '擬似・疑似',
      options: [
        { id: 'opt-19-1', label: 'スード', count: 73, isCustom: false },
        { id: 'opt-19-2', label: 'シュード', count: 258, isCustom: false },
        { id: 'opt-19-3', label: 'プシュード', count: 201, isCustom: false },
        { id: 'opt-19-4', label: 'プソイド', count: 181, isCustom: false },
      ],
    },
    {
      id: 'term-20',
      word: 'i18n',
      description: '国際化',
      options: [
        { id: 'opt-20-1', label: 'アイジュウハチエヌ', count: 236, isCustom: false },
        { id: 'opt-20-2', label: 'アイエイティーンエヌ', count: 268, isCustom: false },
        { id: 'opt-20-3', label: 'アイイチハチエヌ', count: 180, isCustom: false },
        { id: 'opt-20-4', label: 'インターナショナライゼーション', count: 180, isCustom: false },
      ],
    },
    {
      id: 'term-21',
      word: '\\ (backslash)',
      description: 'バックスラッシュ/円記号',
      options: [
        { id: 'opt-21-1', label: 'バックスラッシュ', count: 166, isCustom: false },
        { id: 'opt-21-2', label: 'ぎゃくスラッシュ', count: 219, isCustom: false },
      ],
    },
    {
      id: 'term-22',
      word: '& (ampersand)',
      description: 'アンパサンド/および記号',
      options: [
        { id: 'opt-22-1', label: 'アンド', count: 70, isCustom: false },
        { id: 'opt-22-2', label: 'アンパサンド', count: 232, isCustom: false },
      ],
    },
    {
      id: 'term-23',
      word: 'src',
      description: '画像やスクリプトの参照元属性',
      options: [
        { id: 'opt-23-1', label: 'ソース', count: 116, isCustom: false },
        { id: 'opt-23-2', label: 'エスアールシー', count: 305, isCustom: false },
      ],
    },
    {
      id: 'term-24',
      word: 'via',
      description: '経由を表すラテン語',
      options: [
        { id: 'opt-24-1', label: 'ヴィア', count: 291, isCustom: false },
        { id: 'opt-24-2', label: 'バイア', count: 281, isCustom: false },
        { id: 'opt-24-3', label: 'ヴァイア', count: 260, isCustom: false },
        { id: 'opt-24-4', label: 'ビア', count: 162, isCustom: false },
      ],
    },
    {
      id: 'term-25',
      word: 'regex',
      description: '正規表現',
      options: [
        { id: 'opt-25-1', label: 'レゲックス', count: 170, isCustom: false },
        { id: 'opt-25-2', label: 'レジェックス', count: 307, isCustom: false },
        { id: 'opt-25-3', label: 'リジェックス', count: 173, isCustom: false },
        { id: 'opt-25-4', label: 'レギュエックス', count: 173, isCustom: false },
      ],
    },
    {
      id: 'term-26',
      word: 'GNU',
      description: 'フリーソフトのプロジェクト',
      options: [
        { id: 'opt-26-1', label: 'グヌー', count: 181, isCustom: false },
        { id: 'opt-26-2', label: 'グニュー', count: 30, isCustom: false },
        { id: 'opt-26-3', label: 'ジーエヌユー', count: 264, isCustom: false },
        { id: 'opt-26-4', label: 'ヌー', count: 51, isCustom: false },
      ],
    },
    {
      id: 'term-27',
      word: 'enum',
      description: '列挙型',
      options: [
        { id: 'opt-27-1', label: 'イーナム', count: 86, isCustom: false },
        { id: 'opt-27-2', label: 'エニュム', count: 207, isCustom: false },
        { id: 'opt-27-3', label: 'イニューム', count: 133, isCustom: false },
        { id: 'opt-27-4', label: 'エナム', count: 254, isCustom: false },
      ],
    },
    {
      id: 'term-28',
      word: 'deque',
      description: '両端キュー',
      options: [
        { id: 'opt-28-1', label: 'デック', count: 246, isCustom: false },
        { id: 'opt-28-2', label: 'デキュー', count: 23, isCustom: false },
        { id: 'opt-28-3', label: 'デク', count: 111, isCustom: false },
      ],
    },
    {
      id: 'term-29',
      word: 'wchar',
      description: 'ワイド文字型',
      options: [
        { id: 'opt-29-1', label: 'ダブリューチャー', count: 40, isCustom: false },
        { id: 'opt-29-2', label: 'ダブリューキャラ', count: 238, isCustom: false },
        { id: 'opt-29-3', label: 'ワイドキャラ', count: 162, isCustom: false },
        { id: 'opt-29-4', label: 'ダブリューチャーティー', count: 70, isCustom: false },
      ],
    },
    {
      id: 'term-30',
      word: 'Ubuntu',
      description: 'Linux系ディストリ',
      options: [
        { id: 'opt-30-1', label: 'ウブントゥ', count: 294, isCustom: false },
        { id: 'opt-30-2', label: 'ウブンツ', count: 152, isCustom: false },
        { id: 'opt-30-3', label: 'ウブンチュ', count: 155, isCustom: false },
        { id: 'opt-30-4', label: 'ウーブントゥ', count: 23, isCustom: false },
      ],
    },
    {
      id: 'term-31',
      word: 'PostgreSQL',
      description: 'RDBMS',
      options: [
        { id: 'opt-31-1', label: 'ポスグレ', count: 55, isCustom: false },
        { id: 'opt-31-2', label: 'ポストグレス', count: 303, isCustom: false },
        { id: 'opt-31-3', label: 'ポストグレスキューエル', count: 290, isCustom: false },
        { id: 'opt-31-4', label: 'ポストグレ', count: 245, isCustom: false },
      ],
    },
    {
      id: 'term-32',
      word: 'YAML',
      description: '設定記述フォーマット',
      options: [
        { id: 'opt-32-1', label: 'ヤムル', count: 15, isCustom: false },
        { id: 'opt-32-2', label: 'ヤメル', count: 195, isCustom: false },
      ],
    },
    {
      id: 'term-33',
      word: 'GUID',
      description: '一意識別子',
      options: [
        { id: 'opt-33-1', label: 'ジーユーアイディー', count: 313, isCustom: false },
        { id: 'opt-33-2', label: 'グイッド', count: 149, isCustom: false },
        { id: 'opt-33-3', label: 'グーイド', count: 129, isCustom: false },
      ],
    },
    {
      id: 'term-34',
      word: '^ (caret)',
      description: 'キャレット/べき乗記号',
      options: [
        { id: 'opt-34-1', label: 'キャレット', count: 16, isCustom: false },
        { id: 'opt-34-2', label: 'ハット', count: 198, isCustom: false },
        { id: 'opt-34-3', label: 'サーカムフレックス', count: 148, isCustom: false },
      ],
    },
    {
      id: 'term-35',
      word: '| (pipe)',
      description: 'パイプ/縦棒記号',
      options: [
        { id: 'opt-35-1', label: 'パイプ', count: 275, isCustom: false },
        { id: 'opt-35-2', label: 'たてぼう', count: 50, isCustom: false },
        { id: 'opt-35-3', label: 'バーティカルバー', count: 227, isCustom: false },
        { id: 'opt-35-4', label: 'バー', count: 300, isCustom: false },
      ],
    },
    {
      id: 'term-36',
      word: '{} (braces)',
      description: '波カッコ/中カッコ',
      options: [
        { id: 'opt-36-1', label: 'なみカッコ', count: 145, isCustom: false },
        { id: 'opt-36-2', label: 'ブレース', count: 281, isCustom: false },
        { id: 'opt-36-3', label: 'ちゅうカッコ', count: 147, isCustom: false },
      ],
    },
    {
      id: 'term-37',
      word: '<> (angle brackets)',
      description: '山カッコ/不等号',
      options: [
        { id: 'opt-37-1', label: 'だいなり・しょうなり', count: 125, isCustom: false },
        { id: 'opt-37-2', label: 'やまカッコ', count: 209, isCustom: false },
        { id: 'opt-37-3', label: 'さんかくカッコ', count: 216, isCustom: false },
        { id: 'opt-37-4', label: 'アングルブラケット', count: 80, isCustom: false },
      ],
    },
    {
      id: 'term-38',
      word: 'alt',
      description: 'img要素の代替テキスト属性',
      options: [
        { id: 'opt-38-1', label: 'オルト', count: 284, isCustom: false },
        { id: 'opt-38-2', label: 'アルト', count: 111, isCustom: false },
      ],
    },
    {
      id: 'term-39',
      word: 'nav',
      description: 'ナビゲーション領域の要素',
      options: [
        { id: 'opt-39-1', label: 'ナビ', count: 87, isCustom: false },
        { id: 'opt-39-2', label: 'ナブ', count: 202, isCustom: false },
      ],
    },
    {
      id: 'term-40',
      word: 'li',
      description: 'リストの項目要素',
      options: [
        { id: 'opt-40-1', label: 'エルアイ', count: 40, isCustom: false },
        { id: 'opt-40-2', label: 'リスト', count: 225, isCustom: false },
        { id: 'opt-40-3', label: 'リ', count: 245, isCustom: false },
      ],
    },
    {
      id: 'term-41',
      word: 'verbose',
      description: '詳細出力モード',
      options: [
        { id: 'opt-41-1', label: 'バーボース', count: 120, isCustom: false },
        { id: 'opt-41-2', label: 'バーボーズ', count: 63, isCustom: false },
        { id: 'opt-41-3', label: 'ヴァーボース', count: 35, isCustom: false },
        { id: 'opt-41-4', label: 'バーボス', count: 162, isCustom: false },
      ],
    },
  ];

  return raw.map((t) => ({
    ...t,
    totalVotes: t.options.reduce((acc, o) => acc + o.count, 0),
  }));
}
