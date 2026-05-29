# DevPronounce - エンジニア用語読み方投票アプリ

Webエンジニア界隈で人によって読み方が分かれる技術用語（例: `width`, `height`, `App`, `Kubernetes` など）について、自分の発音を投票し、みんなの読み方の分布を可視化するアプリケーションです。

## ✨ 特徴

*   **直感的な投票UI**: カード形式で次々と単語の読み方を投票できます。
*   **リアルタイム集計**: 投票結果を即座にグラフで確認できます。
*   **カスタム回答**: 選択肢にない読み方も自由に追加して投票可能です。
*   **モダンな技術スタック**: Cloudflare Pages + D1 + Waku (React Framework) で構築された高速でスケーラブルなアーキテクチャ。

## 🛠 技術スタック

*   **Frontend Framework**: [Waku](https://waku.gg/) (Minimal React Framework)
*   **UI Library**: [React](https://react.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (Serverless SQLite)
*   **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
*   **Hosting**: [Cloudflare Pages](https://pages.cloudflare.com/)
*   **Language**: TypeScript

## 🚀 セットアップ手順

### 前提条件

*   Node.js (v18以上推奨)
*   npm
*   Cloudflareアカウント (D1およびPagesの使用に必要)

### 1. インストール

リポジトリをクローンし、依存関係をインストールします。

```bash
git clone <repository-url>
cd dev-pronounce
npm install
```

### 2. Cloudflare D1 データベースの作成

Cloudflare D1 データベースを作成します。

```bash
npx wrangler d1 create dev-pronounce-db
```

コマンド実行後、出力される `database_id` を `wrangler.toml` ファイルに設定してください。

```toml
# wrangler.toml
[[d1_databases]]
binding = "DB"
database_name = "dev-pronounce-db"
database_id = "ここにIDを貼り付け" # <--- ここを更新
migrations_dir = "drizzle"
```

### 3. データベースマイグレーション

データベースのスキーマを作成（適用）します。

**ローカル開発用:**
```bash
npx wrangler d1 migrations apply dev-pronounce-db --local
```

**本番環境用:**
```bash
npx wrangler d1 migrations apply dev-pronounce-db --remote
```

### 4. ローカル開発サーバーの起動

```bash
npm run dev
```
`http://localhost:3000` でアプリが起動します。

## 📦 デプロイ

Cloudflare Pages へのデプロイは以下のコマンドで行います。

```bash
npm run deploy
```

## 📂 ディレクトリ構成

```
dev-pronounce/
├── drizzle/              # Drizzle ORM マイグレーションファイル
├── src/
│   ├── components/       # Reactコンポーネント
│   ├── db/               # データベース接続・スキーマ定義 (Drizzle)
│   ├── routes/           # ページルーティング
│   ├── actions.ts        # Server Actions (データ取得・更新)
│   ├── App.tsx           # メインアプリケーションロジック
│   └── styles.css        # グローバルスタイル (Tailwind directives)
├── drizzle.config.ts     # Drizzle Kit 設定
├── tailwind.config.js    # Tailwind CSS 設定
├── vite.config.ts        # Vite 設定
└── wrangler.toml         # Cloudflare Workers/Pages 設定
```
