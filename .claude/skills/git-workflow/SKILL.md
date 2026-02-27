---
name: git-workflow
description: >
  コミット、ブランチ作成、PR準備など、Gitに関する操作を行う際に使用。
  安全なGitワークフローを自動的に適用します。
allowed-tools: Bash, Read
---

# Git Workflow Guardrails

## ブランチ戦略

```bash
# 機能開発
git checkout -b feature/user-authentication
# バグ修正
git checkout -b fix/login-redirect-loop
# リファクタリング
git checkout -b refactor/extract-auth-hook
```

## コミット前チェックリスト（MUST）
1. `npm run typecheck` → エラー0件
2. `npm run lint` → エラー0件
3. `npm run test` → 全パス
4. 意図しないファイルが含まれていないか確認

## コミットメッセージ規約（Conventional Commits）

```
<type>(<scope>): <subject>

type:
  feat     - 新機能
  fix      - バグ修正
  refactor - リファクタリング（機能変更なし）
  test     - テスト追加・修正
  docs     - ドキュメントのみ
  chore    - ビルド、依存関係など
  style    - フォーマットのみ

例:
feat(auth): ソーシャルログイン機能を追加
fix(cart): 数量が0の商品が削除されない問題を修正
```

## IMPORTANT: やってはいけないこと
- `main`/`master` に直接コミット・プッシュしない
- `--force-push` は原則禁止（自分のブランチ以外絶対禁止）
- `.env`、シークレット、個人情報を含むファイルをコミットしない
- 1コミットに複数の無関係な変更を含めない

## PR前の確認
```bash
# 差分の確認
git diff main...HEAD --stat

# タイプチェック
npm run typecheck

# テスト
npm run test -- --run

# ビルド確認
npm run build
```
