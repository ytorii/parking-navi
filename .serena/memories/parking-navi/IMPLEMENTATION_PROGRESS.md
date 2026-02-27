# 駐車ナビ実装進捗

## Phase 1: プロジェクト初期化 [開始]

### 初期化コマンド
```bash
cd /c/Users/metal/dev/MoblieApps/parking-navi
npm create vite@latest . -- --template react-ts
npm install firebase react-router clsx lucide-react motion sonner
npm install -D @tailwindcss/vite tailwindcss vite-plugin-pwa prettier
```

### campusからコピーするファイル
- `vite.config.ts` - PWA manifest名を「駐車ナビ」、theme_colorを`#0f172a`に変更
- `tsconfig.json / tsconfig.app.json / tsconfig.node.json` - そのまま
- `eslint.config.js` - そのまま
- `index.html` - ダークテーマ用meta、タイトル変更
- `src/main.tsx / src/App.tsx / src/index.css` - ほぼそのまま

### キーの違い
- 駐車場：theme_color: #0f172a (ダークテーマ)
- キャンプ：theme_color: #16a34a (グリーン)

## Phase 2: 型定義
- `src/types/parkingLot.ts` - ParkingLot型, AvailabilityStatus, AvailabilityReport型定義

## Phase 3: Firebase/Hooks
- campusの`lib/firebase/`, `lib/camps.ts`, `hooks/` パターンをコピー
- parkingLots.ts, reports.ts（サブコレクション）を実装

## Phase 4-5: コンポーネント & ページ
- ダーク化したコンポーネント一覧（StatusBadge, FacilityIcons, ParkingLotCard等）
- 5ページ（Home, ParkingDetail, ParkingForm, ReportForm, SeedPage）

## ダークテーマカラー
- bg: slate-900, slate-800
- text: slate-100, slate-400
- accent: blue-400
