# DevPronounce — エンジニア用語 読み方投票アプリ

Webエンジニア界隈で人によって読み方が分かれる技術用語（例: `width`, `Kubernetes`, `char`, `GIF`, `nginx`, `null`, `SQL` など）について、自分の発音を投票し、みんなの読み方の分布を可視化するアプリケーションです。

UI は **陽気なポップ・ネオブルータリズム** で構築しています。温かいクリーム地に、イエロー＋コバルトの2アクセントと等幅フォント。グラデーションやグラスモーフィズムは使わず、太枠・ハードなオフセット影・角丸ゼロという骨格はそのままに、色と言葉づかいで「ゆるくて楽しい投票」の雰囲気を出しています。

## ✨ 特徴

- **直感的な投票UI**: カード形式で次々と単語の読み方を投票できます。
- **リアルタイム集計**: 投票するとその場で結果バー（自前実装）に分布が表示されます。自分が選んだ読み方には `YOU →` マーカーが付きます。
- **カスタム回答**: 選択肢にない読み方も自由に追加して投票できます。
- **新しい用語の登録**: ユーザーが単語・説明・読み方候補（2件以上）を登録でき、その場で投票デッキに追加されます。
- **論争ランキング & シェア**: 「いちばん割れている用語」を割れ度スコアで可視化（`/ranking`）。用語ごとのパーマリンク（`/t/[id]`）と Web Share / X 投稿に対応。
- **逆張り度メーター**: 自分の投票がどれだけ少数派かを診断してシェアできます。
- **職種・経験年数で傾向比較**（任意入力）: 「あなたのインフラ・SREでは」「12年〜世代では」のように、属性ごとの読み方の偏りを全体との差付きで表示します。
- **アクセシビリティ**: WCAG AA を意識したコントラスト、可視フォーカスリング、色覚特性に依存しない結果バー（順位は色・順位番号・数値・バー幅で冗長にエンコード）。
- **モダンな技術スタック**: Cloudflare Workers (Static Assets) + D1 + Waku (React Framework) による高速・スケーラブルな構成。

## 🛠 技術スタック

- **Frontend Framework**: [Waku](https://waku.gg/) (Minimal React Framework / React Server Components)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)（カスタムデザイントークン）
- **Fonts**: Space Grotesk / JetBrains Mono / Noto Sans JP
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (Serverless SQLite)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Hosting**: [Cloudflare Workers](https://developers.cloudflare.com/workers/)（静的アセット同梱）
- **Language**: TypeScript

## 🚀 セットアップ手順

### 前提条件

- Node.js（v20 以上推奨）
- npm
- （本番デプロイ・リモートD1を使う場合のみ）Cloudflare アカウント

### 1. インストール

```bash
git clone <repository-url>
cd dev-pronounce
npm install
```

### 2. すぐに起動（Cloudflare不要・モックデータ）

D1 のセットアップなしで、すぐに UI を確認できます。`waku dev` の開発サーバーが起動し、D1 バインディングが無い場合は **開発時専用の in-memory モックデータ**にフォールバックします（投票・新規登録もメモリ上で動作。再起動でリセットされます）。

```bash
npm run dev
# → http://localhost:3000
```

> モックは開発時 (`import.meta.env.DEV`) のみ。本番ビルドでは D1 が必須で、欠落時はエラーになります（フェイクデータを黙って返しません）。

### 3. ローカル D1 で動かす（本番と同じ経路）

実際の D1（miniflare のローカルDB）で動かす場合の手順です。

```bash
# マイグレーション適用 + サンプルデータ投入（初回のみ）
npm run db:setup:local

# 本番ビルドして wrangler dev で起動（D1 バインディングあり）
npm run dev:cf
# → http://localhost:8787
```

`wrangler.jsonc` には D1 データベースの設定が既に入っています（`database_name: "dev-pronounce"`）。自分の Cloudflare アカウントで新規に作成する場合は次を実行し、出力された `database_id` を `wrangler.jsonc` に反映してください。

```bash
npx wrangler d1 create dev-pronounce
```

```jsonc
// wrangler.jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "dev-pronounce",
    "database_id": "ここに自分のIDを貼り付け",
    "migrations_dir": "drizzle"
  }
]
```

## 📦 デプロイ（Cloudflare Workers）

リモート D1 にマイグレーションとサンプルデータを適用してから、ビルド & デプロイします。

```bash
npm run db:migrate:remote   # リモートD1へマイグレーション適用
npm run db:seed:remote      # （任意）サンプルデータ投入
npm run deploy              # waku build && wrangler deploy
```

## 🧰 npm スクリプト

| スクリプト | 内容 |
| --- | --- |
| `npm run dev` | `waku dev`（HMR・http://localhost:3000・Cloudflare不要、D1が無ければモックデータ） |
| `npm run dev:cf` | `waku build && wrangler dev`（ローカルD1バインディングあり） |
| `npm run build` | `waku build`（`dist/` を生成） |
| `npm run deploy` | ビルドして `wrangler deploy` |
| `npm run type-check` | `tsc --noEmit` |
| `npm run db:generate` | スキーマからマイグレーション生成（drizzle-kit） |
| `npm run db:migrate:local` / `:remote` | マイグレーション適用 |
| `npm run db:seed:local` / `:remote` | `db/seed.sql` ＋ `db/seed-segments.sql`（セグメント合成データ）を投入 |
| `npm run db:setup:local` | ローカルD1へ マイグレーション + シード をまとめて実行 |
| `npm run db:reset:local` | ローカルD1を初期化してセットアップし直す |

## 📂 ディレクトリ構成

```
dev-pronounce/
├── db/
│   ├── seed.sql              # サンプルデータ（マイグレーションとは分離）
│   └── seed-segments.sql     # 職種/経験年数のセグメント合成データ（デモ用）
├── drizzle/                  # Drizzle ORM マイグレーション（migrations_dir）
│   ├── 0000_*.sql
│   └── meta/
├── src/
│   ├── components/
│   │   ├── generic/          # Header / Footer / VotingCard / ResultBars /
│   │   │                     #   AddTermForm / ProgressTape
│   │   └── pages/App.tsx     # メインアプリ（状態管理・画面遷移）
│   ├── db/
│   │   ├── schema.ts         # Drizzle スキーマ定義
│   │   ├── storage.ts        # D1 アクセス + 開発時モックフォールバック + addTerm
│   │   └── mockData.ts       # 開発時用サンプルデータ
│   ├── middleware/cloudflare.ts
│   ├── pages/
│   │   ├── _layout.tsx       # フォント読み込み + ページシェル
│   │   └── index.tsx         # ルート
│   ├── actions.ts            # Server Actions（loadTerms / vote / addTerm）
│   ├── server-entry.tsx      # Waku × Cloudflare アダプタ
│   ├── types.ts              # 型 + 入力上限の定数
│   └── styles.css            # Tailwind ディレクティブ + ベーススタイル
├── drizzle.config.ts
├── tailwind.config.cjs       # デザイントークン（色・影・フォント等）
├── postcss.config.cjs
├── tsconfig.json
└── wrangler.jsonc            # Cloudflare Workers / D1 設定
```
