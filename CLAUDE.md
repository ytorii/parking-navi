# 駐車ナビ

> このファイルはClaude Codeが毎セッション最初に読み込む設定ファイルです。

## 技術スタック

- **Framework**: React 19 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS v4
- **State**: React Context（Auth）/ useState（ローカル）/ Firestore onSnapshot（サーバー）
- **Routing**: React Router v7
- **Auth**: Firebase Authentication（Google ログイン）
- **Backend**: Cloud Firestore
- **Animation**: motion（framer-motion v12+）
- **Icons**: lucide-react
- **Toast**: sonner
- **Utility**: clsx
- **PWA**: vite-plugin-pwa / Workbox

## よく使うコマンド

```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint
npm run format       # Prettier
```

## コードスタイル

- ESModules（import/export）を使う
- 関数コンポーネント + Hooks のみ
- Props は必ずインターフェースで型定義する
- `any` は禁止。`unknown` を使うこと
- ファイル名: コンポーネントは `PascalCase.tsx`、ユーティリティは `camelCase.ts`

## ディレクトリ構成

```
src/
├── components/     # 再利用可能なUIコンポーネント
├── contexts/       # React Context（AuthContext）
├── hooks/          # カスタムフック（useAuth, useParkingLots等）
├── pages/          # ルートに対応するページコンポーネント
├── lib/            # 外部ライブラリの設定・ラッパー
│   └── firebase/   # Firebase 初期化（app, firestore, auth）
└── types/          # グローバル型定義（parkingLot.ts）
```

## コンポーネント規約

- 1ファイル1コンポーネント
- Propsの型は `ComponentNameProps` という名前で同ファイル内に定義
- デフォルトエクスポートを使う
- カスタムフックにビジネスロジックを切り出す

## ダークテーマカラー

| 用途 | クラス |
|------|--------|
| 背景 | `bg-slate-900` |
| カード | `bg-slate-800 border-slate-700` |
| テキスト | `text-slate-100` / `text-slate-400` |
| アクセント | `text-blue-400` / `bg-blue-600` |
| 入力 | `bg-slate-700 border-slate-600` |
| 成功 | `bg-green-900 text-green-200` |
| 警告 | `bg-yellow-900 text-yellow-200` |
| エラー | `bg-red-900 text-red-200` |

## Gitワークフロー

- 機能ごとに新しいブランチを切る（`feature/xxx`, `fix/xxx`）
- コミット前に `typecheck` と `lint` を通す
- Claudeは直接 `master` ブランチにコミットしない

## セキュリティ

- 環境変数は `.env.local` に記載し、`.gitignore` に含める
- `VITE_` プレフィックスのついた変数のみクライアントに公開される
- ユーザー入力は必ずバリデーション・サニタイズする
