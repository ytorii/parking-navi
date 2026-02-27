---
description: Reactコンポーネント、contexts、pagesを編集する際に適用されるルール
globs:
  - "src/components/**/*"
  - "src/contexts/**/*"
  - "src/pages/**/*"
---

# React コンポーネントルール

> 詳細: docs/coding-guideline.md 参照

## コンポーネントファイル構造

```
1. Import（順序: React → サードパーティ → @/内部 → 相対 → スタイル → type）
2. Props インターフェース定義（ComponentNameProps）
3. コンポーネント関数（export default function）
```

- 1ファイル1コンポーネント
- 150行を超えたら分割を検討
- デフォルトエクスポート

## Props 設計

- `interface ComponentNameProps` で型定義（同ファイル内）
- optional props の乱用禁止 → Discriminated Unions で状態を明示
- children は `React.ReactNode` で型付け
- イベントハンドラは `on*` 命名（`onClick`, `onSubmit`, `onChange`）
- boolean props は `is*` / `has*` / `can*` 命名

## コンポジション

- 子コンポーネントに責務を分離
- ビジネスロジックはカスタムフック（`use*.ts`）に切り出す
- Compound Component パターンは複雑なUI（タブ、アコーディオン等）に適用

## 条件付きレンダリング

- Early return を優先（loading, error, empty 状態）
- `&&` と数値の falsy に注意 → `count > 0 &&` を使う
- 三項演算子は短い場合のみ

## Hooks 使用ルール

- useEffect は外部システムとの同期のみ（API、WebSocket、DOM API）
- 派生状態は useMemo で計算（useEffect + setState 禁止）
- イベントハンドラ内で副作用を直接実行（useEffect 経由にしない）
- useEffect には必ずクリーンアップ関数を書く（subscription, timer, AbortController）
- 依存配列を省略しない

## アクセシビリティ必須チェック

- `<button>` / `<a>` を使う（`<div onClick>` 禁止）
- アイコンのみのボタンには `aria-label` 必須
- `<img>` には `alt` 必須（装飾画像は `alt=""`）
- 見出し階層を飛ばさない（h1 → h2 → h3）
- フォーム要素に `<label>` を紐付ける（`htmlFor` + `id`）
- エラーメッセージに `role="alert"` を付与
- モーダルにフォーカストラップを実装

## エラーハンドリング

- 遅延ロードコンポーネントは `<Suspense fallback={...}>` でラップ
- 非同期エラーは `try/catch` で処理
- ローディング / エラー / 空状態の3状態を必ず実装

## スタイリング（Tailwind CSS v4）

- クラス順序: レイアウト → スペーシング → サイズ → タイポ → ビジュアル → インタラクティブ → レスポンシブ
- 条件付きクラスは `clsx` / `cn` を使用
- arbitrary values `[16px]` は Tailwind ユーティリティが存在しない場合のみ
