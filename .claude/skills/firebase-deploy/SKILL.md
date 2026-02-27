---
name: firebase-deploy
description: >
  Firebase へのビルド＆デプロイを一括実行します。
  本番環境へのデプロイ前に必要な検証も自動実行します。
allowed-tools: Bash, Read
---

# Firebase Deploy Skill

## 概要

このスキルは以下の処理を自動実行します：

1. **事前チェック**
   - TypeScript 型チェック (`npm run typecheck`)
   - ESLint チェック (`npm run lint`)

2. **ビルド**
   - 本番用ビルド (`npm run build`)

3. **デプロイ**
   - Firebase Hosting へのデプロイ
   - Firestore ルール・インデックスのデプロイ
   - Firebase Authentication の設定

## 使用方法

```bash
/firebase-deploy
```

## デプロイ対象

- **Hosting**: `dist/` 内のファイル
- **Firestore**: `firestore.rules`, `firestore.indexes.json`
- **Auth**: `firebase.json` で定義された認証プロバイダー

## デプロイ前のチェックリスト（MUST）

✅ 変更内容が意図したものか確認
✅ `.env.local` / `.claude/settings.local.json` など機密ファイルが含まれていないか確認
✅ GitHub にコミット・プッシュ済みか確認（本番反映前）

## デプロイ後の確認

デプロイ完了後、以下を確認してください：

- **Hosting URL**: https://parking-navi-app.web.app
- **Project Console**: https://console.firebase.google.com/project/parking-navi-app/overview
- **機能テスト**:
  - ログイン機能が動作しているか
  - データの読み込みが正常か
  - エラーが表示されていないか

## トラブルシューティング

**デプロイが失敗する場合:**
- `firebase login` で認証状態を確認
- `.firebaserc` の `projects.default` が正しいプロジェクト ID か確認
- Firebase CLI のバージョンを更新: `npm install -g firebase-tools`

**ビルドが失敗する場合:**
- `npm run typecheck` でエラーを確認
- `npm run lint` でリント警告を確認
- `dist/` ディレクトリを削除して再ビルド: `rm -rf dist && npm run build`
