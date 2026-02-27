# Campus Project - Copilot Instructions

> 詳細: docs/coding-guideline.md 参照

## コンテキスト

React 19 + TypeScript strict + Vite + Tailwind CSS v4 + React Router v7 + Firebase (Auth + Firestore) + motion + lucide-react + sonner

## コード生成ルール

### TypeScript

- `any` 禁止。`unknown` + type guard を使う
- Props は `interface ComponentNameProps { ... }` で定義
- `as` 型アサーション禁止 → `satisfies` または type guard
- `import type {}` で型のみインポート

### コンポーネント

- 関数コンポーネント + Hooks のみ（クラスコンポーネント禁止）
- `export default function ComponentName` でエクスポート
- 1ファイル1コンポーネント
- boolean props: `is*` / `has*` / `can*` 命名
- イベントハンドラ: `on*` 命名

### Import 順序

```
1. React
2. サードパーティ（react-router, motion/react, lucide-react, sonner 等）
3. 内部（@/components, @/hooks, @/lib, @/contexts）
4. 相対パス
5. スタイル
6. import type {}
```

各グループ間に空行。グループ内はアルファベット順。

### Hooks

- カスタムフック名は `use*` で始める
- `useEffect` は外部同期のみ（Firestore onSnapshot, DOM API）
- 派生状態は `useMemo` で計算（`useEffect` + `setState` 禁止）
- `useEffect` にはクリーンアップ関数を書く

### テスト生成

- Vitest + React Testing Library
- `getByRole` 優先、`getByTestId` は最終手段
- `userEvent` を使う（`fireEvent` ではなく）
- `describe` / `it` 構造、日本語テスト名可
- Arrange / Act / Assert パターン

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

describe('ComponentName', () => {
  it('振る舞いの説明', async () => {
    const user = userEvent.setup();
    render(<ComponentName />);
    await user.click(screen.getByRole('button', { name: '送信' }));
    expect(screen.getByText('完了')).toBeInTheDocument();
  });
});
```

### スタイリング

- Tailwind CSS v4 ユーティリティクラスを使用
- 条件付きクラス: `clsx` を使用
- インラインスタイル `style={{}}` は避ける

### エラーハンドリング

- 遅延ロードコンポーネントは `<Suspense fallback={...}>` でラップ
- 非同期は `try/catch`
- ローディング / エラー / 空状態の3状態を実装

### アクセシビリティ

- セマンティックHTML: `<button>`, `<nav>`, `<main>`, `<label>`
- `<div onClick>` 禁止 → `<button>` を使う
- アイコンボタンに `aria-label`
- `<img>` に `alt` 必須
- フォーム: `<label htmlFor>` + `<input id>`

### 状態管理

- ローカル: `useState`
- 認証: React Context（`AuthContext` + `useAuth`）
- サーバー: Firestore `onSnapshot` リアルタイム購読

## 禁止パターン

- `any` / `@ts-ignore` / `@ts-expect-error`
- `as` 型アサーション
- クラスコンポーネント
- `require()`
- `<div onClick>` / `<span onClick>`
- `console.log`（デバッグ用を除く）
- リストの `key={index}`
- `fireEvent`（テスト）
- `container.querySelector`（テスト）

## ファイル命名

- コンポーネント: `PascalCase.tsx`
- フック: `use*.ts`
- ユーティリティ: `camelCase.ts`
- テスト: `*.test.tsx`
