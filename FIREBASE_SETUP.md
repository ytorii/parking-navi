# Firebase 認証設定 - 手動手順

Google Sign-in エラーが出た場合、以下を Firebase Console で実施してください。

## 1. Google Sign-in プロバイダを有効化

1. [Firebase Console](https://console.firebase.google.com/) を開く
2. `parking-navi-app` プロジェクトを選択
3. 左メニュー → **Authentication**（認証）
4. **Sign-in method** タブをクリック
5. **Google** をクリック
6. トグルを **ON** にする
7. プロジェクト名 / サポートメール を入力
8. **Save** をクリック

## 2. OAuth 同意画面を設定

1. Google Cloud Console を開く（上記リンクから遷移できます）
2. **OAuth consent screen** をクリック
3. User type: **External** を選択（テスト用）
4. **Create** をクリック
5. App name: `駐車ナビ`
6. User support email: `torii.ontheslope@gmail.com`
7. Developer contact: `torii.ontheslope@gmail.com`
8. **Save and Continue**

## 3. テスト用ユーザーを追加

1. **Test users** セクションで **Add users** をクリック
2. 自分の Google アカウント（torii.ontheslope@gmail.com）を追加
3. **Save**

## 4. localhost を許可リストに追加

Firebase Console の認証設定で：
1. **Authorization domain** セクションをスクロール
2. `http://localhost:5173` を追加
3. `http://127.0.0.1:5173` も追加

## 5. ブラウザキャッシュをクリア

1. ブラウザの DevTools を開く（F12）
2. **Application** タブ
3. **Cookies** → `localhost` を右クリック → Delete
4. **Local Storage** → `http://localhost:5173` を削除
5. ページをリロード（Ctrl+Shift+R）

これで Google ログインが動作するはずです！
