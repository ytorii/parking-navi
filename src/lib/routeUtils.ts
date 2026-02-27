export interface LatLng {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Haversine公式による2点間距離 (km) */
export function haversineDistance(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/** 出発地〜目的地の総距離 (km) */
export function totalDistance(from: LatLng, to: LatLng): number {
  return haversineDistance(from, to);
}

/**
 * 点Pから折れ線（polyline）への最短距離 (km) と
 * 路線上の正規化位置（0.0〜1.0）を返す。
 * 各セグメントに pointToSegmentResult を適用し、最小距離のものを採用。
 */
export function pointToPolylineResult(
  p: LatLng,
  polyline: LatLng[],
): { distanceKm: number; position: number } {
  if (polyline.length < 2) {
    const dist = polyline.length === 1 ? haversineDistance(p, polyline[0]) : 0;
    return { distanceKm: dist, position: 0 };
  }

  // 各セグメントの累積距離を事前計算
  const segLengths: number[] = [];
  let totalLen = 0;
  for (let i = 0; i < polyline.length - 1; i++) {
    const len = haversineDistance(polyline[i], polyline[i + 1]);
    segLengths.push(len);
    totalLen += len;
  }

  let bestDist = Infinity;
  let bestPosition = 0;

  let cumulativeBefore = 0;
  for (let i = 0; i < polyline.length - 1; i++) {
    const { distanceKm, position } = pointToSegmentResult(p, polyline[i], polyline[i + 1]);
    if (distanceKm < bestDist) {
      bestDist = distanceKm;
      // 全体の 0〜1 に正規化
      bestPosition =
        totalLen > 0 ? (cumulativeBefore + position * segLengths[i]) / totalLen : 0;
    }
    cumulativeBefore += segLengths[i];
  }

  return { distanceKm: bestDist, position: bestPosition };
}

/**
 * 点Pから線分AB への最短距離 (km) と
 * 路線上の射影位置（0.0〜1.0, from=0 / to=1）を返す。
 * 緯度経度をデカルト近似して計算する（中距離まで十分な精度）。
 */
export function pointToSegmentResult(
  p: LatLng,
  a: LatLng,
  b: LatLng,
): { distanceKm: number; position: number } {
  // lat/lng を km 単位のデカルト座標に変換（a を原点）
  const latScale = EARTH_RADIUS_KM * (Math.PI / 180);
  const lngScale = EARTH_RADIUS_KM * (Math.PI / 180) * Math.cos(toRad((a.lat + b.lat) / 2));

  const ax = 0;
  const ay = 0;
  const bx = (b.lng - a.lng) * lngScale;
  const by = (b.lat - a.lat) * latScale;
  const px = (p.lng - a.lng) * lngScale;
  const py = (p.lat - a.lat) * latScale;

  const abLen2 = bx * bx + by * by;

  if (abLen2 === 0) {
    // 出発地と目的地が同じ点
    const dx = px - ax;
    const dy = py - ay;
    return { distanceKm: Math.sqrt(dx * dx + dy * dy), position: 0 };
  }

  // 射影係数 t ∈ [0, 1]
  const t = Math.max(0, Math.min(1, (px * bx + py * by) / abLen2));

  const closestX = ax + t * bx;
  const closestY = ay + t * by;
  const dx = px - closestX;
  const dy = py - closestY;

  return {
    distanceKm: Math.sqrt(dx * dx + dy * dy),
    position: t,
  };
}
