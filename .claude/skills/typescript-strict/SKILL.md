---
name: typescript-strict
description: >
  TypeScriptの型定義、型エラー修正、型安全なAPIクライアント実装など
  TypeScript固有の作業をする際に使用。
allowed-tools: Read, Write, Edit, Bash, Grep
---

# TypeScript Strict Mode Expert

## 型安全の原則

### 絶対に使ってはいけない
```ts
// ❌ 禁止
const data: any = fetchData();
const el = document.getElementById('app') as HTMLElement; // 非nullアサーション多用
// @ts-ignore
```

### 代わりに使うパターン
```ts
// ✅ unknown + type guard
function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null && 'id' in value;
}

// ✅ nullチェック
const el = document.getElementById('app');
if (!el) throw new Error('app element not found');

// ✅ satisfies演算子（型推論を保ちつつ型チェック）
const config = {
  endpoint: '/api/v1',
  timeout: 5000,
} satisfies ApiConfig;
```

## 便利なユーティリティ型

```ts
// APIレスポンス型のパターン
type ApiResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// 一部だけ必須にする
type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Readonly深い版
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
```

## Zodによるランタイムバリデーション（推奨）
```ts
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  createdAt: z.coerce.date(),
});

type User = z.infer<typeof UserSchema>; // 型を自動生成

// APIレスポンスのバリデーション
const response = await fetch('/api/users/1');
const user = UserSchema.parse(await response.json()); // 型安全
```

## tsconfig.json 推奨設定
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```
