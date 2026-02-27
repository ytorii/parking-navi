# Campus コーディングガイドライン

> 詳細: このドキュメントはプロジェクトの正典的なコーディングガイドラインです。
> AIガードレールファイル（`.cursorrules`, `.github/copilot-instructions.md`, `.claude/rules/`）はこのドキュメントから凝縮して生成されています。

## 目次

1. [コンポーネント設計パターン](#1-コンポーネント設計パターン)
2. [Hooks ルールとアンチパターン](#2-hooks-ルールとアンチパターン)
3. [Import 順序規約](#3-import-順序規約)
4. [エラーハンドリング](#4-エラーハンドリング)
5. [アクセシビリティ（a11y）](#5-アクセシビリティa11y)
6. [テスト戦略](#6-テスト戦略)
7. [スタイリング規約（Tailwind CSS v4）](#7-スタイリング規約tailwind-css-v4)
8. [パフォーマンス指針](#8-パフォーマンス指針)
9. [認証パターン（Firebase Auth）](#9-認証パターンfirebase-auth)
10. [アニメーション・アイコン・トースト](#10-アニメーションアイコントースト)

---

## 1. コンポーネント設計パターン

### 1.1 基本構造テンプレート

すべてのコンポーネントはこのテンプレートに従う:

```tsx
// React / サードパーティ
import { useState } from 'react';

// 内部モジュール
import { CampCard } from '@/components/CampCard';
import { useAuth } from '@/hooks/useAuth';

// 型（type-only import）
import type { Camp } from '@/types/camp';

// --- Props 定義 ---
interface UserCardProps {
  user: User;
  onSelect: (userId: string) => void;
  isHighlighted?: boolean;
}

// --- コンポーネント ---
export default function UserCard({ user, onSelect, isHighlighted = false }: UserCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    onSelect(user.id);
  };

  return (
    <article
      className={`rounded-lg border p-4 ${isHighlighted ? 'border-blue-500' : 'border-gray-200'}`}
      aria-label={`${user.name}のプロフィールカード`}
    >
      <h3 className="text-lg font-semibold">{user.name}</h3>
      {isExpanded && <p className="mt-2 text-gray-600">{user.bio}</p>}
      <Button onClick={handleClick}>選択</Button>
    </article>
  );
}
```

### 1.2 コンポジションパターン

子コンポーネントに分解して責務を分離する。150行を超えたら分割を検討。

```tsx
// Compound Component パターン（複雑なUIに適用）
interface TabsProps {
  children: React.ReactNode;
  defaultValue: string;
}

function Tabs({ children, defaultValue }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div role="tablist">{children}</div>
    </TabsContext.Provider>
  );
}

function TabPanel({ value, children }: { value: string; children: React.ReactNode }) {
  const { activeTab } = useTabsContext();
  if (activeTab !== value) return null;
  return <div role="tabpanel">{children}</div>;
}

// 使用例
<Tabs defaultValue="profile">
  <Tab value="profile">プロフィール</Tab>
  <Tab value="settings">設定</Tab>
  <TabPanel value="profile"><ProfileForm /></TabPanel>
  <TabPanel value="settings"><SettingsForm /></TabPanel>
</Tabs>
```

### 1.3 条件付きレンダリング

```tsx
// Good: Early return（推奨）
if (!user) return <EmptyState message="ユーザーが見つかりません" />;
if (isLoading) return <Skeleton />;

// Good: 短い三項演算子
<span>{isOnline ? 'オンライン' : 'オフライン'}</span>

// Bad: && と数値（falsyの罠）
// count が 0 の場合 "0" が表示されてしまう
{count && <Badge count={count} />}

// Good: 明示的に比較する
{count > 0 && <Badge count={count} />}
```

### 1.4 Discriminated Unions による型安全な Props

optional props の乱用を避け、Union型で状態を明示する:

```tsx
// Bad: どの組み合わせが有効か不明
interface ButtonProps {
  variant?: 'primary' | 'danger';
  href?: string;
  onClick?: () => void;
}

// Good: 各バリアントで必要なpropsが明確
type ButtonProps =
  | { variant: 'link'; href: string; onClick?: never }
  | { variant: 'action'; onClick: () => void; href?: never };
```

---

## 2. Hooks ルールとアンチパターン

### 2.1 カスタムフックの設計原則

- 命名: 必ず `use` プレフィックス（`useAuth`, `useFormState`）
- 単一責務: 1つのフックは1つの関心事
- 戻り値: オブジェクト `{ data, isLoading, error }` またはタプル `[value, setter]`

```tsx
// Good: 明確な責務と戻り値
export function useUserProfile(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetchUser(userId)
      .then((data) => {
        if (!cancelled) setUser(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [userId]);

  return { user, isLoading, error };
}
```

### 2.2 useEffect のアンチパターン

```tsx
// Bad: 派生状態に useEffect を使う
const [items, setItems] = useState<Item[]>([]);
const [filteredItems, setFilteredItems] = useState<Item[]>([]);
useEffect(() => {
  setFilteredItems(items.filter(item => item.isActive));
}, [items]);

// Good: useMemo で計算する
const filteredItems = useMemo(
  () => items.filter(item => item.isActive),
  [items]
);

// Bad: イベントハンドラのロジックを useEffect に書く
useEffect(() => {
  if (submitted) {
    sendAnalytics('form_submit');
    setSubmitted(false);
  }
}, [submitted]);

// Good: イベントハンドラ内で直接実行
const handleSubmit = () => {
  submitForm();
  sendAnalytics('form_submit');
};
```

### 2.3 useEffect が本当に必要なケース

- 外部システムとの同期（API、WebSocket、DOM API）
- サブスクリプション（イベントリスナー、タイマー）
- コンポーネントマウント時のデータフェッチ（Firestore onSnapshot 購読）

```tsx
// Good: クリーンアップ付きの外部同期
useEffect(() => {
  const controller = new AbortController();

  fetchData({ signal: controller.signal })
    .then(setData)
    .catch((err) => {
      if (!controller.signal.aborted) setError(err);
    });

  return () => controller.abort();
}, [dependency]);

// Good: イベントリスナーのクリーンアップ
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

### 2.4 依存配列のルール

- 依存配列は省略しない（無限ループの原因）
- ESLint の `react-hooks/exhaustive-deps` に従う
- オブジェクト/配列の依存は `useMemo` でメモ化するか、プリミティブ値を渡す

---

## 3. Import 順序規約

グループ間に空行を入れ、各グループ内はアルファベット順:

```tsx
// 1. React
import { useEffect, useState } from 'react';

// 2. サードパーティライブラリ
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Tent } from 'lucide-react';

// 3. 内部モジュール（@/ エイリアス）
import { CampCard } from '@/components/CampCard';
import { useAuth } from '@/hooks/useAuth';
import { formatTimestamp } from '@/lib/time';

// 4. 相対パス（親 → 兄弟 → 子）
import { Header } from '../Header';
import { Sidebar } from './Sidebar';

// 5. スタイル
import './UserPage.css';

// 6. 型（type-only import）
import type { Camp } from '@/types/camp';
```

### パスエイリアス設定（Vite）

```ts
// vite.config.ts
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
```

```json
// tsconfig.json（paths設定）
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

## 4. エラーハンドリング

### 4.1 Error Boundary パターン

> **注意**: `react-error-boundary` は現在未インストールです。必要時に `npm install react-error-boundary` で追加してください。

`react-error-boundary` ライブラリを使用:

```tsx
import { ErrorBoundary } from 'react-error-boundary';

// フォールバックコンポーネント
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-6">
      <h2 className="text-lg font-semibold text-red-800">エラーが発生しました</h2>
      <p className="mt-2 text-red-600">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        再試行
      </button>
    </div>
  );
}

// 使用例: ページ単位でラップ
<ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => navigate('/')}>
  <UserDashboard />
</ErrorBoundary>
```

### 4.2 非同期エラーハンドリング

Error Boundary は非同期エラーを捕捉しない。`try/catch` で処理する:

```tsx
// ApiResult 型で成功/失敗を明示（typescript-strict skill 参照）
type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

const handleSubmit = async () => {
  try {
    const result = await createUser(formData);
    if (result.success) {
      toast.success('ユーザーを作成しました');
      navigate(`/users/${result.data.id}`);
    } else {
      setError(result.error);
    }
  } catch (err) {
    setError('予期しないエラーが発生しました。時間をおいて再度お試しください。');
  }
};
```

### 4.3 フォームバリデーション（Zod）

> **注意**: `zod` は現在未インストールです。必要時に `npm install zod` で追加してください。

```tsx
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1, '名前は必須です').max(50, '50文字以内で入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  age: z.number().int().min(0).max(150).optional(),
});

type UserFormData = z.infer<typeof userSchema>;

const handleSubmit = (rawData: unknown) => {
  const result = userSchema.safeParse(rawData);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    setFieldErrors(errors);
    return;
  }
  // result.data は UserFormData として型安全
  submitUser(result.data);
};
```

---

## 5. アクセシビリティ（a11y）

### 5.1 基本原則

- **目標**: WCAG 2.1 Level AA 準拠
- **原則**: セマンティックHTMLを最優先。ARIA は補助的に使用

### 5.2 セマンティックHTML

```tsx
// Bad: div でレイアウト
<div class="header">...</div>
<div class="main">...</div>
<div class="footer">...</div>

// Good: セマンティック要素
<header>...</header>
<main>...</main>
<footer>...</footer>

// その他の重要な要素
<nav>      // ナビゲーション
<section>  // テーマ付きセクション
<article>  // 独立したコンテンツ
<aside>    // サイドバー・補足情報
```

### 5.3 インタラクティブ要素

```tsx
// Bad: div に onClick
<div onClick={handleClick} className="cursor-pointer">削除</div>

// Good: button 要素を使用
<button onClick={handleClick} type="button">削除</button>

// Good: ナビゲーションは a/Link
<Link to="/settings">設定</Link>

// Good: アイコンのみのボタンには aria-label
<button onClick={toggleMenu} aria-label="メニューを開く" type="button">
  <MenuIcon aria-hidden="true" />
</button>
```

### 5.4 見出し階層

```tsx
// Good: 正しい階層（レベルを飛ばさない）
<h1>ダッシュボード</h1>
  <h2>最近のアクティビティ</h2>
    <h3>今日</h3>
    <h3>昨日</h3>
  <h2>統計</h2>

// Bad: h1 → h3（h2 を飛ばしている）
<h1>ダッシュボード</h1>
  <h3>最近のアクティビティ</h3>
```

### 5.5 フォームのアクセシビリティ

```tsx
// Good: label と input の紐付け
<div>
  <label htmlFor="email">メールアドレス</label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? 'email-error' : undefined}
  />
  {errors.email && (
    <p id="email-error" role="alert" className="text-red-600">
      {errors.email}
    </p>
  )}
</div>
```

### 5.6 キーボード操作

- すべてのインタラクティブ要素が Tab キーでフォーカス可能
- モーダル内でフォーカストラップを実装
- Escape キーでモーダル/ダイアログを閉じる
- フォーカス状態を視覚的に明示（`focus-visible` を使用）

### 5.7 画像とメディア

```tsx
// 意味のある画像: 説明的な alt
<img src={user.avatar} alt={`${user.name}のプロフィール写真`} />

// 装飾的な画像: 空の alt
<img src="/decorative-line.svg" alt="" aria-hidden="true" />

// カラーコントラスト
// 通常テキスト: 4.5:1 以上
// 大きいテキスト(18px以上 or 14px太字以上): 3:1 以上
```

---

## 6. テスト戦略

### 6.1 クエリ優先度（MUST）

アクセシビリティの高い順に使用する:

| 優先度 | クエリ | 用途 |
|--------|--------|------|
| 1 | `getByRole` | ボタン、リンク、見出し等（最も推奨） |
| 2 | `getByLabelText` | フォーム要素 |
| 3 | `getByPlaceholderText` | プレースホルダ付き入力 |
| 4 | `getByText` | 表示テキストで検索 |
| 5 | `getByDisplayValue` | 入力の現在値 |
| 6 | `getByTestId` | **最終手段**のみ |

**禁止**: `container.querySelector`, `getByClassName`

### 6.2 テストの基本構造

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  it('有効な入力でフォームを送信できる', async () => {
    // Arrange
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    // Act
    await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await user.type(screen.getByLabelText('パスワード'), 'password123');
    await user.click(screen.getByRole('button', { name: 'ログイン' }));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('空のメールアドレスでバリデーションエラーを表示する', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'ログイン' }));

    expect(screen.getByRole('alert')).toHaveTextContent('メールアドレスは必須です');
  });
});
```

### 6.3 非同期テスト

```tsx
// findBy* は自動で待機する（waitFor 内蔵）
const successMessage = await screen.findByText('保存しました');
expect(successMessage).toBeInTheDocument();

// waitFor は複数の assertion が必要な場合
await waitFor(() => {
  expect(screen.getByRole('list')).toBeInTheDocument();
  expect(screen.getAllByRole('listitem')).toHaveLength(3);
});
```

### 6.4 テスト対象の判断基準

**テストすべきこと:**
- ユーザーから見える振る舞い（クリック、入力、表示）
- 条件付きレンダリング（ローディング、エラー、空状態）
- フォームバリデーションとエラーメッセージ
- ナビゲーション遷移
- エッジケース（空配列、長い文字列、null値）

**テストしないこと:**
- 内部 state の値（`useState` の中身）
- 実装の詳細（useEffect の呼び出し回数、内部メソッド名）
- CSS クラス名やスタイル
- サードパーティライブラリの内部動作

### 6.5 モックの方針

```tsx
// API呼び出しのモック
vi.mock('@/lib/api', () => ({
  fetchUsers: vi.fn(),
}));

// 外部ライブラリのモックは最小限
// 子コンポーネントはモックしない（統合テストの価値が下がる）
```

---

## 7. スタイリング規約（Tailwind CSS v4）

### 7.1 クラスの記述順序

一貫性のため、以下の順序で記述:

```tsx
<div
  className="
    flex items-center justify-between    {/* 1. レイアウト */}
    gap-4 p-6 mx-auto                    {/* 2. スペーシング */}
    w-full max-w-lg h-16                 {/* 3. サイズ */}
    text-sm font-medium text-gray-800    {/* 4. タイポグラフィ */}
    bg-white border border-gray-200      {/* 5. ビジュアル */}
    rounded-lg shadow-sm                 {/* 5. ビジュアル（続き） */}
    hover:bg-gray-50 focus:ring-2        {/* 6. インタラクティブ */}
    transition-colors duration-200       {/* 7. アニメーション */}
    sm:flex-row md:p-8 lg:max-w-xl       {/* 8. レスポンシブ */}
  "
/>
```

### 7.2 条件付きクラス

`clsx`（または `cn` ユーティリティ）を使用:

```tsx
import { clsx } from 'clsx';

interface BadgeProps {
  variant: 'success' | 'warning' | 'error';
  children: React.ReactNode;
}

export default function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
        {
          'bg-green-100 text-green-800': variant === 'success',
          'bg-yellow-100 text-yellow-800': variant === 'warning',
          'bg-red-100 text-red-800': variant === 'error',
        }
      )}
    >
      {children}
    </span>
  );
}
```

### 7.3 避けるべきパターン

- arbitrary values `[16px]` — Tailwind に対応するユーティリティがある場合は使わない
- インラインスタイル `style={{}}` — Tailwind で表現できない場合のみ
- `@apply` の多用 — コンポーネント化で解決すべき

---

## 8. パフォーマンス指針

### 8.1 メモ化の判断基準

**React.memo** — 以下の場合のみ:
- 親が頻繁に再レンダーし、子のpropsが変わらない場合
- レンダーコストが高い（大きなリスト、複雑なUI）
- React DevTools Profiler で再レンダーを確認した場合

**useMemo** — 以下の場合のみ:
- 計算が高コスト（O(n^2) 以上、1000件以上のフィルタ/ソート等）
- 結果オブジェクト/配列を子の props に渡す場合

**useCallback** — 以下の場合のみ:
- `React.memo` でラップされた子コンポーネントに渡すコールバック
- useEffect の依存配列に含まれる関数

```tsx
// Good: 計測して必要と判断した場合
const sortedItems = useMemo(
  () => items.toSorted((a, b) => a.name.localeCompare(b.name)),
  [items]
);

// Bad: 単純な計算をメモ化（オーバーヘッドの方が大きい）
const fullName = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName]);
```

### 8.2 コード分割

ルート単位で `React.lazy` + `Suspense` を使用（実際の `App.tsx` 参照）:

```tsx
import { Suspense, lazy } from 'react';

const Home = lazy(() => import('@/pages/Home'));
const CampDetail = lazy(() => import('@/pages/CampDetail'));
const CampForm = lazy(() => import('@/pages/CampForm'));

function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/camps/:campId" element={<CampDetail />} />
        <Route path="/camps/new" element={<ProtectedRoute><CampForm /></ProtectedRoute>} />
      </Routes>
    </Suspense>
  );
}
```

### 8.3 リストの最適化

```tsx
// MUST: 一意な key を使用（index は禁止）
{camps.map(camp => (
  <CampCard key={camp.id} camp={camp} />
))}

// 100件以上のリスト: 仮想化を検討
```

### 8.4 画像の最適化

- `loading="lazy"` で遅延読み込み
- 適切な `width` / `height` を指定（CLS 防止）
- WebP/AVIF フォーマットを優先

---

## 9. 認証パターン（Firebase Auth）

### 9.1 AuthProvider + useAuth

認証状態は React Context で管理する:

```tsx
// contexts/AuthContext.tsx — AuthProvider コンポーネント
// contexts/authContextDef.ts — Context 型定義・createContext
// hooks/useAuth.ts — useContext ラッパー

// 使用例
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <LoginPrompt />;
  return <Dashboard user={user} />;
}
```

### 9.2 ProtectedRoute

認証が必要なルートは `ProtectedRoute` でガードする:

```tsx
<Route
  path="/camps/new"
  element={
    <ProtectedRoute>
      <CampForm />
    </ProtectedRoute>
  }
/>
```

---

## 10. アニメーション・アイコン・トースト

### 10.1 motion（framer-motion）

```tsx
// import は motion/react から
import { motion, AnimatePresence } from 'motion/react';

// 基本のアニメーション
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
/>
```

### 10.2 lucide-react（アイコン）

```tsx
import { Tent, MapPin, Star } from 'lucide-react';

// サイズ・色は props で制御
<Tent className="h-5 w-5 text-green-600" />
```

### 10.3 sonner（トースト）

```tsx
import { toast } from 'sonner';

// 成功・エラー通知
toast.success('保存しました');
toast.error('エラーが発生しました');

// Toaster は App.tsx の AuthProvider 内に配置済み
```
