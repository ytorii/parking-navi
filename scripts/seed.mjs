/**
 * Firestore シードスクリプト
 *
 * 使い方:
 *   node scripts/seed.mjs
 *
 * Figma モックデータ (campSites.ts) を参考に、全7地域のサンプルキャンプ場を
 * Firestore に投入します。
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { readFileSync } from 'fs';

// .env.local を読み込む
const envPath = new URL('../.env.local', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const envContent = readFileSync(envPath, 'utf-8');
const env = Object.fromEntries(
  envContent
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    }),
);

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
});

const db = getFirestore(app);

// ── Figma campSites.ts を参考にしたサンプルデータ ──────────────────────────
// region は7種: '北海道' | '東北' | '関東' | '中部' | '関西' | '中国・四国' | '九州・沖縄'
// type   は2種: 'glamping' | 'campsite'
// seasons: 'spring' | 'summer' | 'autumn' | 'winter'
const camps = [
  // ── 中部 ──
  {
    name: '森のグランピングリゾート',
    location: '長野県軽井沢町',
    region: '中部',
    type: 'glamping',
    description: '浅間山を望む高原に広がる本格グランピング施設。プライベート感あふれるドームテントで贅沢なアウトドア体験を。',
    features: ['キャンピングカーOK', 'ドッグランあり'],
    seasons: ['spring', 'summer', 'autumn'],
    pricePerNight: 28000,
    nearbyAttractions: ['軽井沢アウトレット', '白糸の滝', '旧軽井沢銀座通り'],
    address: '長野県北佐久郡軽井沢町長倉',
    phone: '0267-XX-XXXX',
    businessHours: 'チェックイン15:00 / チェックアウト11:00',
    url: 'https://example.com/mori-glamping',
    memo: null,
    imageUrls: ['https://images.unsplash.com/photo-1652355115501-50032eba3a52?w=800'],
  },
  {
    name: '湖畔のファミリーキャンプ場',
    location: '山梨県河口湖町',
    region: '中部',
    type: 'campsite',
    description: '富士山と河口湖を一望できるロケーション。家族連れに人気の広々としたサイト。',
    features: ['キャンピングカーOK'],
    seasons: ['spring', 'summer', 'autumn'],
    pricePerNight: 6500,
    nearbyAttractions: ['河口湖', '富士山五合目', '富士急ハイランド'],
    address: '山梨県南都留郡富士河口湖町',
    phone: '0555-XX-XXXX',
    businessHours: 'チェックイン13:00 / チェックアウト11:00',
    url: null,
    memo: null,
    imageUrls: ['https://images.unsplash.com/photo-1600452556550-9ff29bb0e6cf?w=800'],
  },
  // ── 関東 ──
  {
    name: 'マウンテンビューグランピング',
    location: '群馬県みなかみ町',
    region: '関東',
    type: 'glamping',
    description: '谷川岳を望む絶景グランピング。ラフティングや温泉など周辺アクティビティも充実。',
    features: ['ドッグランあり'],
    seasons: ['spring', 'summer', 'autumn', 'winter'],
    pricePerNight: 22000,
    nearbyAttractions: ['谷川岳', 'たくみの里', 'みなかみ温泉'],
    address: '群馬県利根郡みなかみ町',
    phone: '0278-XX-XXXX',
    businessHours: 'チェックイン15:00 / チェックアウト10:00',
    url: null,
    memo: null,
    imageUrls: ['https://images.unsplash.com/photo-1633803504744-1b8a284cd3cc?w=800'],
  },
  {
    name: 'サンセットビーチキャンプ',
    location: '千葉県南房総市',
    region: '関東',
    type: 'campsite',
    description: '太平洋に沈む夕日を眺めながらキャンプ。海水浴・釣り・BBQが楽しめるビーチサイドの人気スポット。',
    features: ['キャンピングカーOK'],
    seasons: ['spring', 'summer'],
    pricePerNight: 5000,
    nearbyAttractions: ['千倉海岸', '道の駅三芳村', '館山城'],
    address: '千葉県南房総市千倉町',
    phone: '0470-XX-XXXX',
    businessHours: 'チェックイン14:00 / チェックアウト11:00',
    url: null,
    memo: null,
    imageUrls: ['https://images.unsplash.com/photo-1736803594436-c8c31c4871f2?w=800'],
  },
  // ── 北海道 ──
  {
    name: '知床ワイルドライフキャンプ',
    location: '北海道斜里町',
    region: '北海道',
    type: 'campsite',
    description: '世界遺産・知床の大自然の中で過ごす野趣あふれるキャンプ。ヒグマの生息域にも近い大自然の宝庫。',
    features: [],
    seasons: ['summer', 'autumn'],
    pricePerNight: 3500,
    nearbyAttractions: ['知床五湖', 'カムイワッカ湯の滝', 'フレペの滝'],
    address: '北海道斜里郡斜里町',
    phone: '0152-XX-XXXX',
    businessHours: 'チェックイン13:00 / チェックアウト11:00',
    url: null,
    memo: null,
    imageUrls: ['https://images.unsplash.com/photo-1639019459785-23deb5ec1fc0?w=800'],
  },
  {
    name: '洞爺湖パノラマキャンプ',
    location: '北海道洞爺湖町',
    region: '北海道',
    type: 'glamping',
    description: '洞爺湖と有珠山を望む絶景グランピング。夏の花火大会が湖上から観賞できる特別なロケーション。',
    features: ['キャンピングカーOK', 'ドッグランあり'],
    seasons: ['spring', 'summer', 'autumn'],
    pricePerNight: 18000,
    nearbyAttractions: ['洞爺湖温泉', '昭和新山', '有珠山ロープウェイ'],
    address: '北海道虻田郡洞爺湖町',
    phone: '0142-XX-XXXX',
    businessHours: 'チェックイン15:00 / チェックアウト10:00',
    url: null,
    memo: null,
    imageUrls: ['https://images.unsplash.com/photo-1746478621977-0a6692e93982?w=800'],
  },
  // ── 東北 ──
  {
    name: '奥入瀬渓流リトリート',
    location: '青森県十和田市',
    region: '東北',
    type: 'glamping',
    description: '奥入瀬渓流のほとりに立つ森のリトリート。苔むす森の中で静寂と自然の音に包まれる贅沢な時間。',
    features: ['ドッグランあり'],
    seasons: ['spring', 'summer', 'autumn'],
    pricePerNight: 35000,
    nearbyAttractions: ['奥入瀬渓流', '十和田湖', '銚子大滝'],
    address: '青森県十和田市奥瀬',
    phone: '0176-XX-XXXX',
    businessHours: 'チェックイン15:00 / チェックアウト11:00',
    url: null,
    memo: null,
    imageUrls: ['https://images.unsplash.com/photo-1746478621977-0a6692e93982?w=800'],
  },
  // ── 関西 ──
  {
    name: '天空の里グランピング',
    location: '奈良県吉野町',
    region: '関西',
    type: 'glamping',
    description: '世界遺産・吉野山の山上に広がるグランピング施設。春は桜、秋は紅葉と四季折々の絶景が楽しめる。',
    features: ['キャンピングカーOK'],
    seasons: ['spring', 'summer', 'autumn'],
    pricePerNight: 25000,
    nearbyAttractions: ['吉野山千本桜', '金峯山寺', '吉水神社'],
    address: '奈良県吉野郡吉野町吉野山',
    phone: '0746-XX-XXXX',
    businessHours: 'チェックイン15:00 / チェックアウト10:00',
    url: null,
    memo: null,
    imageUrls: ['https://images.unsplash.com/photo-1600452556550-9ff29bb0e6cf?w=800'],
  },
  {
    name: '琵琶湖ウォーターフロントキャンプ',
    location: '滋賀県大津市',
    region: '関西',
    type: 'campsite',
    description: '日本最大の湖・琵琶湖のほとりで楽しむ湖水浴とキャンプ。SUPやカヤックなどウォータースポーツも体験できる。',
    features: ['キャンピングカーOK', 'ドッグランあり'],
    seasons: ['spring', 'summer'],
    pricePerNight: 7000,
    nearbyAttractions: ['琵琶湖大橋', '比叡山延暦寺', '近江八幡'],
    address: '滋賀県大津市',
    phone: '077-XXX-XXXX',
    businessHours: 'チェックイン13:00 / チェックアウト11:00',
    url: null,
    memo: null,
    imageUrls: ['https://images.unsplash.com/photo-1639019459785-23deb5ec1fc0?w=800'],
  },
  // ── 中国・四国 ──
  {
    name: '四万十リバーグランピング',
    location: '高知県四万十市',
    region: '中国・四国',
    type: 'glamping',
    description: '日本最後の清流・四万十川のほとりで過ごす特別な体験。沈下橋を眺めながら川の流れに耳を傾ける。',
    features: ['ドッグランあり'],
    seasons: ['spring', 'summer', 'autumn'],
    pricePerNight: 20000,
    nearbyAttractions: ['四万十川沈下橋', '足摺岬', '四万十市街'],
    address: '高知県四万十市西土佐',
    phone: '0880-XX-XXXX',
    businessHours: 'チェックイン15:00 / チェックアウト10:00',
    url: null,
    memo: null,
    imageUrls: ['https://images.unsplash.com/photo-1633803504744-1b8a284cd3cc?w=800'],
  },
  {
    name: '大山ブナの森キャンプ場',
    location: '鳥取県大山町',
    region: '中国・四国',
    type: 'campsite',
    description: '中国地方最高峰・大山の麓に広がるキャンプ場。ブナの原生林に囲まれた神秘的な環境でハイキングも楽しめる。',
    features: ['キャンピングカーOK'],
    seasons: ['spring', 'summer', 'autumn'],
    pricePerNight: 4500,
    nearbyAttractions: ['大山登山道', '鳥取砂丘', '境港水産物直売センター'],
    address: '鳥取県西伯郡大山町',
    phone: '0859-XX-XXXX',
    businessHours: 'チェックイン13:00 / チェックアウト11:00',
    url: null,
    memo: null,
    imageUrls: ['https://images.unsplash.com/photo-1633803504744-1b8a284cd3cc?w=800'],
  },
  // ── 九州・沖縄 ──
  {
    name: '高千穂峡グランピング',
    location: '宮崎県高千穂町',
    region: '九州・沖縄',
    type: 'glamping',
    description: '神話の里・高千穂峡を望む絶景グランピング。神社巡りや峡谷ボートなど神秘的な体験が満載。',
    features: ['ドッグランあり'],
    seasons: ['spring', 'summer', 'autumn', 'winter'],
    pricePerNight: 23000,
    nearbyAttractions: ['高千穂峡', '天岩戸神社', '高千穂神社'],
    address: '宮崎県西臼杵郡高千穂町',
    phone: '0982-XX-XXXX',
    businessHours: 'チェックイン15:00 / チェックアウト10:00',
    url: null,
    memo: null,
    imageUrls: ['https://images.unsplash.com/photo-1746478621977-0a6692e93982?w=800'],
  },
  {
    name: '宮古島サンゴグランピング',
    location: '沖縄県宮古島市',
    region: '九州・沖縄',
    type: 'glamping',
    description: '透明度抜群の宮古ブルーを望むビーチフロントグランピング。シュノーケリングや星空観察で南国の自然を満喫。',
    features: ['キャンピングカーOK'],
    seasons: ['spring', 'summer', 'autumn'],
    pricePerNight: 32000,
    nearbyAttractions: ['与那覇前浜ビーチ', '砂山ビーチ', '伊良部大橋'],
    address: '沖縄県宮古島市',
    phone: '0980-XX-XXXX',
    businessHours: 'チェックイン15:00 / チェックアウト11:00',
    url: null,
    memo: null,
    imageUrls: ['https://images.unsplash.com/photo-1736803594436-c8c31c4871f2?w=800'],
  },
];

// ── Firestore に投入 ───────────────────────────────────────────────────────
const campsRef = collection(db, 'camps');

let count = 0;
for (const camp of camps) {
  await addDoc(campsRef, {
    ...camp,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  count++;
  console.log(`✅ [${count}/${camps.length}] ${camp.name} (${camp.region})`);
}

console.log(`\n🎉 ${count}件のキャンプ場を Firestore に追加しました。`);
process.exit(0);
