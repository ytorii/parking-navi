---
description: テストファイルを作成・編集する際に適用されるルール
globs:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/__tests__/**/*"
---

# テストルール（Vitest + React Testing Library）

> 詳細: docs/coding-guideline.md 参照

## テストファイル構造

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('振る舞いを日本語で記述', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ComponentName />);

    // Act
    await user.click(screen.getByRole('button', { name: '送信' }));

    // Assert
    expect(screen.getByText('完了')).toBeInTheDocument();
  });
});
```

## クエリ優先度（MUST）

1. `getByRole` — 最も推奨（ボタン、リンク、見出し等）
2. `getByLabelText` — フォーム要素
3. `getByPlaceholderText` — プレースホルダ付き入力
4. `getByText` — 表示テキスト
5. `getByDisplayValue` — 入力の現在値
6. `getByTestId` — **最終手段のみ**

**禁止**: `container.querySelector`, `getByClassName`

## ユーザーイベント

- `userEvent`（`@testing-library/user-event`）を使う。`fireEvent` は使わない
- セットアップ: `const user = userEvent.setup();`
- クリック: `await user.click(element)`
- 入力: `await user.type(element, 'テキスト')`

## 非同期テスト

- `findBy*` は自動待機（waitFor 内蔵）→ 優先的に使う
- `waitFor` は複数 assertion が必要な場合のみ
- `act()` は明示的に呼ばない（Testing Library が処理する）

## テストすべきこと

- ユーザーから見える振る舞い（クリック → 結果表示）
- 条件付きレンダリング（loading / error / empty 状態）
- フォームバリデーションとエラーメッセージ
- エッジケース（空配列、null、長い文字列）

## テストしないこと

- 内部 state の値
- useEffect の呼び出し回数
- CSS クラス名やスタイル
- サードパーティライブラリの内部動作
- 実装の詳細（メソッド名、内部変数）

## モック方針

- API 呼び出し: `vi.mock('@/lib/api', () => ({ ... }))`
- 子コンポーネントはモックしない（統合テストの価値を維持）
- モックは最小限に。外部依存のみモックする
