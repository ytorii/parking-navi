import type { Timestamp } from 'firebase/firestore';

export type CampType = 'glamping' | 'campsite';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type Region = '北海道' | '東北' | '関東' | '中部' | '関西' | '中国・四国' | '九州・沖縄';

export type DogRunPrice = {
  small?: string;
  medium?: string;
  large?: string;
  general?: string;
};

export type DogRunInfo = {
  separatedBySize: boolean;      // 大型/小型犬エリア分離
  areaDescription: string | null; // 広さ（例："約200㎡"）
  surface: string | null;         // 地面種別（芝/土/砂利/砂等）
  hasFence: boolean;              // 柵の有無
  hasWater: boolean;              // 水飲み場あり
  vaccinationRequired: boolean;   // ワクチン証明書要否
  rules: string | null;           // 利用ルール・注意事項
  hours: string | null;           // 利用時間帯
};

export interface Camp {
  id: string;
  name: string;
  location: string;
  address: string | null;
  phone: string | null;
  businessHours: string | null;
  url: string | null;
  memo: string | null;
  imageUrls: string[];
  type: CampType;
  region: Region | null;
  description: string | null;
  features: string[];
  seasons: Season[];
  pricePerNight: number | null;
  rating: number | null;
  nearbyAttractions: string[];
  // Figma-aligned fields
  capacity: number | null;
  camperVanAllowed: boolean;
  hasDogRun: boolean;
  dogRunPrice: DogRunPrice | null;
  dogRunInfo: DogRunInfo | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CampPayload {
  name: string;
  location: string;
  address: string | null;
  phone: string | null;
  businessHours: string | null;
  url: string | null;
  memo: string | null;
  imageUrls: string[];
  type: CampType;
  region: Region | null;
  description: string | null;
  features: string[];
  seasons: Season[];
  pricePerNight: number | null;
  rating: number | null;
  nearbyAttractions: string[];
  capacity: number | null;
  camperVanAllowed: boolean;
  hasDogRun: boolean;
  dogRunPrice: DogRunPrice | null;
  dogRunInfo: DogRunInfo | null;
}
