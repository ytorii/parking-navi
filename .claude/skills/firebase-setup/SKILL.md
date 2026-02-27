---
name: firebase-setup
description: >
  Firebase プロジェクトの新規セットアップを行う。Firebase MCP を使用して
  プロジェクト作成・Firestore初期化・ウェブアプリ登録・SDK設定取得・
  .env.local 作成・インデックスデプロイまでを一括実施する。
  「Firebaseを設定したい」「新しいFirebaseプロジェクトを作る」などのリクエストで使用。
allowed-tools: Bash, Read, Write, Edit
---

# Firebase プロジェクト セットアップ

Firebase MCP を前提とした Vite + React PWA 向けのセットアップ手順。
各ステップを順番に実行し、ユーザーの確認を取りながら進める。

---

## Step 0: 事前確認

開始前に以下を確認する：

1. Firebase MCP がセッションで利用可能なこと
2. `firebase.json` が存在しないこと（既存プロジェクトへの追加の場合は Step 3 から）
3. `.env.local` が存在しないこと（上書きリスク確認）

---

## Step 1: Firebase CLI のインストール確認

```bash
firebase --version
```

コマンドが見つからない場合はユーザーに手動インストールを依頼する：

```bash
npm install -g firebase-tools
```

> ⚠️ `npm install -g` は Claude が自動実行しない。ユーザーが手動で実行する。

---

## Step 2: Firebase MCP でログイン

Firebase MCP の **`firebase_login`** ツールでログイン状態を確認・実行する。
既にログイン済みであればスキップしてよい。

---

## Step 3: Firebase プロジェクトの作成または選択

### 新規プロジェクトを作成する場合

Firebase MCP の **`firebase_create_project`** ツールを使用する：

| パラメータ | 説明 | 例 |
|-----------|------|----|
| `project_id` | グローバル一意の識別子（英小文字・数字・ハイフン） | `my-app-2025` |
| `display_name` | コンソール上の表示名（自由） | `My App` |

### 既存プロジェクトを使用する場合

Firebase MCP の **`firebase_list_projects`** でプロジェクト一覧を確認し、
使用するプロジェクト ID をユーザーに選択してもらう。

---

## Step 4: Firestore の初期化

Firebase MCP の **`firebase_init`** ツールを使用して Firestore を初期化する：

- **リージョン**: `asia-northeast1`（東京、日本向けアプリに推奨）
- **セキュリティルール**: 開発用の全許可ルール（後述の Step 7 で確認）

`firebase_init` 実行後、プロジェクトルートに以下が生成される：
- `firebase.json`
- `firestore.rules`
- `firestore.indexes.json`

---

## Step 5: ウェブアプリの登録

Firebase MCP の **`firebase_create_app`** ツールを使用する：

| パラメータ | 値 |
|-----------|-----|
| `platform` | `WEB` |
| `display_name` | アプリ表示名（任意） |

---

## Step 6: SDK 設定の取得と `.env.local` 作成

Firebase MCP の **`firebase_get_sdk_config`** ツールで設定情報を取得し、
プロジェクトルートに `.env.local` を新規作成する：

```env
VITE_FIREBASE_API_KEY=<取得した apiKey>
VITE_FIREBASE_AUTH_DOMAIN=<取得した authDomain>
VITE_FIREBASE_PROJECT_ID=<取得した projectId>
VITE_FIREBASE_STORAGE_BUCKET=<取得した storageBucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<取得した messagingSenderId>
VITE_FIREBASE_APP_ID=<取得した appId>
```

作成後、`.gitignore` に `.env.local` が含まれていることを確認する。
含まれていない場合は追記する。

---

## Step 7: Firestore セキュリティルールの確認

`firestore.rules` が以下の開発用全許可ルールになっていることを確認する：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

> ⚠️ **本番リリース前に必ず認証・認可ルールへ変更すること。**
> このルールではインターネット上の誰でもデータを読み書きできる。

---

## Step 8: Firestore インデックスの設定

`firestore.indexes.json` を確認・更新する。

### 重要: `fieldOverrides` の完全置換に注意

`fieldOverrides` エントリは、そのフィールドの**自動インデックスを完全に置換**する。
`COLLECTION_GROUP` スコープのみ記載すると、通常の `COLLECTION` スコープが削除され、
per-campのクエリ（`subscribePosts(campId)`）が壊れる。

**必ず4スコープ全て列挙すること：**

```json
{
  "indexes": [],
  "fieldOverrides": [
    {
      "collectionGroup": "posts",
      "fieldPath": "createdAt",
      "indexes": [
        { "order": "ASCENDING",  "queryScope": "COLLECTION" },
        { "order": "DESCENDING", "queryScope": "COLLECTION" },
        { "order": "ASCENDING",  "queryScope": "COLLECTION_GROUP" },
        { "order": "DESCENDING", "queryScope": "COLLECTION_GROUP" }
      ]
    }
  ]
}
```

### なぜ COLLECTION_GROUP インデックスが必要か

`collectionGroup('posts').orderBy('createdAt', 'desc')` のようなサブコレクション横断クエリは、
Firestore が自動作成しない **COLLECTION_GROUP スコープのインデックス**を要求する。
インデックスが未作成のままだと `onSnapshot` が一切コールバックを呼ばず、
`loading` が永久に `true` のまま固まる（エラーハンドラなしの場合）。

---

## Step 9: `firebase.json` の確認・設定

Firebase Hosting を使用する場合、`firebase.json` に以下を確認・追記する：

```json
{
  "firestore": {
    "database": "(default)",
    "location": "asia-northeast1",
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      { "source": "**", "destination": "/index.html" }
    ]
  }
}
```

`"rewrites"` の `** → /index.html` は React Router の SPA ディープリンクに必須。

---

## Step 10: Firestore インデックスのデプロイ

Firebase CLI（MCP とは独立した CLI ツール）でインデックスをデプロイする：

```bash
firebase login          # CLI 側のログイン（MCPと別途必要な場合がある）
firebase use <project-id>
firebase deploy --only firestore:indexes
```

デプロイ後、インデックスのビルドに**数分**かかる。
Firestore コンソールの「インデックス」タブで「有効」になるまで待つ。

> ビルド中はクエリが失敗する（`The query requires an index` や `not ready yet` エラー）。

---

## Step 11: 動作確認

```bash
npm install   # 依存パッケージが未インストールの場合
npm run dev
```

ブラウザで以下を確認：
- Firestore への読み書きが正常に動作すること
- ブラウザのコンソールにインデックスエラーが出ないこと
- リアルタイム購読（`onSnapshot`）が機能すること（別タブで変更 → 即時反映）

---

## トラブルシューティング

### 「読み込み中...」が永遠に消えない

`collectionGroup` クエリのインデックスが未作成または未ビルド。

1. ブラウザのコンソールで `FirebaseError` を確認
2. エラーメッセージ内の URL から Firestore コンソールへ直接アクセスしてインデックスを作成
3. `firebase deploy --only firestore:indexes` 後に数分待つ
4. インデックスビルド中はページをリロードしても症状が続く（正常）

対策（根本解決）: `onSnapshot` に必ずエラーハンドラを渡し、エラー時に `loading = false` にする：

```typescript
return onSnapshot(
  q,
  (snapshot) => { onChange(data); },
  (error) => {
    console.error('[subscribe]', error);
    onError?.(error);   // loading を false にして UI をアンフリーズ
  },
);
```

### 詳細画面の投稿一覧も壊れた（`fieldOverrides` の落とし穴）

`fieldOverrides` を追加すると、指定フィールドの**全自動インデックスが削除**される。
`COLLECTION_GROUP` のみ追加した場合、`COLLECTION` スコープが消えてしまう。

→ Step 8 の4スコープ全列挙バージョンに更新して `firebase deploy --only firestore:indexes` を再実行。

### `.env.local` の変更が反映されない

Vite は `.env.local` の変更後に再起動が必要。

```bash
# Ctrl+C で停止後
npm run dev
```

### `firebase` コマンドが見つからない

```bash
npm install -g firebase-tools
```

PATH が通っていない場合は `npx firebase` で代替できる。
