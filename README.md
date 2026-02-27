# 駐車ナビ

長距離トラック運転手向けの駐車場空き情報サービス。広島県を中心にSA/PA・道の駅・トラックステーション等の空き状況をリアルタイムで表示するPWA。

## 主な機能

- **駐車場一覧** — 登録済み駐車場をカード形式で表示
- **検索・フィルター** — 名前、住所、地域、施設タイプで検索
- **駐車場詳細** — 電話番号、営業時間、設備、Google Maps埋め込み表示
- **空き状況レポート** — ユーザーが空き状況を投稿（4択：空き/やや混雑/混雑/満車）
- **レポート履歴** — 各駐車場の最新レポート一覧表示
- **PWA対応** — ホーム画面追加でネイティブアプリ感覚で利用可能
- **ダークテーマ** — 夜間運転手向けの目に優しいデザイン

## 技術スタック

| カテゴリ | ライブラリ / ツール |
|----------|---------------------|
| フレームワーク | React 19 |
| 言語 | TypeScript (strict) |
| ビルド | Vite 6 |
| スタイリング | Tailwind CSS v4 |
| ルーティング | React Router v7 |
| バックエンド | Firebase (Firestore + Auth) |
| アニメーション | motion (framer-motion v12+) |
| アイコン | lucide-react |
| トースト | sonner |
| PWA | vite-plugin-pwa / Workbox |
| テスト | Vitest + React Testing Library |
| Linting | ESLint + Prettier |

## 環境構築

### 前提条件

- **Node.js 20 以上**
- **Firebase CLI** — `npm install -g firebase-tools`

### 手順

1. **リポジトリのクローンと依存関係のインストール**

```bash
git clone <repository-url>
cd parking-navi
npm install
```

2. **Firebase プロジェクトの用意**

[Firebase コンソール](https://console.firebase.google.com/) で以下の設定を行います：

- プロジェクトを作成（または既存プロジェクトを使用）
- **Firestore Database** を有効化（リージョン: `asia-northeast1` 推奨）
- **Hosting** を有効化
- **ウェブアプリ** を登録してSDK設定を取得

3. **環境変数の設定**

プロジェクトルートに `.env.local` を作成し、Firebase コンソールから取得した値を設定します：

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

4. **開発サーバーの起動**

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開きます。

5. **シードデータの投入（開発時）**

ログイン後、`/admin/seed` ページからシードデータを投入できます。

## コマンド一覧

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバー起動（HMR 有効） |
| `npm run build` | プロダクションビルド（`dist/` に出力） |
| `npm run preview` | ビルド成果物のローカルプレビュー |
| `npm run typecheck` | TypeScript 型チェック |
| `npm run lint` | ESLint によるコード検査 |
| `npm run format` | Prettier によるコード整形 |
| `npm run test` | Vitest によるテスト実行 |
| `npm run test:ui` | Vitest UI でテストを視覚的に確認 |

## デプロイ

Firebase Hosting へのデプロイ：

```bash
npm run build
firebase deploy --only hosting
```

Firestore ルールを変更した場合：

```bash
firebase deploy --only firestore:rules
```

全リソースをまとめてデプロイ：

```bash
firebase deploy
```

## ディレクトリ構成

```
parking-navi/
├── public/                  # 静的アセット
├── src/
│   ├── main.tsx             # エントリーポイント
│   ├── App.tsx              # ルーティング定義
│   ├── index.css            # Tailwind CSS
│   ├── components/          # 再利用可能なUIコンポーネント
│   ├── contexts/            # React Context
│   ├── hooks/               # カスタムフック
│   ├── lib/                 # Firebase, データアクセス層
│   ├── pages/               # ルートに対応するページコンポーネント
│   └── types/               # グローバル型定義
├── firestore.rules          # Firestore セキュリティルール
├── firebase.json            # Firebase プロジェクト設定
├── vite.config.ts           # Vite + PWA 設定
├── tsconfig.json            # TypeScript 設定
└── package.json
```

## ⚠️ セキュリティに関する注意事項

現在の `firestore.rules` は**開発・検証用**です。本番環境へのデプロイ前に認証・認可ルールを設定してください。
