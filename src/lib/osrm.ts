export interface OsrmRouteResult {
  coordinates: { lat: number; lng: number }[];
  distanceKm: number;
  durationSec: number;
}

/**
 * OSRM 公開APIで2点間の道路経路を取得する。
 * 失敗時は null を返す（呼び出し側でフォールバック処理をする）。
 */
export async function fetchRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  timeoutMs = 8000,
): Promise<OsrmRouteResult | null> {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${from.lng},${from.lat};${to.lng},${to.lat}` +
    `?overview=full&geometries=geojson`;

  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timerId);

    if (!res.ok) {
      console.warn(`[osrm] HTTP ${res.status}`);
      return null;
    }

    const json: unknown = await res.json();
    return parseOsrmResponse(json);
  } catch (err) {
    clearTimeout(timerId);
    console.warn('[osrm] fetchRoute failed:', err);
    return null;
  }
}

function parseOsrmResponse(json: unknown): OsrmRouteResult | null {
  if (
    typeof json !== 'object' ||
    json === null ||
    !('code' in json) ||
    (json as Record<string, unknown>)['code'] !== 'Ok'
  ) {
    console.warn('[osrm] unexpected response', json);
    return null;
  }

  const data = json as Record<string, unknown>;
  const routes = data['routes'];

  if (!Array.isArray(routes) || routes.length === 0) {
    console.warn('[osrm] no routes found');
    return null;
  }

  const route = routes[0] as Record<string, unknown>;
  const distanceM = typeof route['distance'] === 'number' ? route['distance'] : 0;
  const durationSec = typeof route['duration'] === 'number' ? route['duration'] : 0;

  const geometry = route['geometry'] as Record<string, unknown> | undefined;
  if (!geometry || !Array.isArray(geometry['coordinates'])) {
    console.warn('[osrm] missing geometry');
    return null;
  }

  // GeoJSON は [lng, lat] 順なのでアプリの { lat, lng } に変換
  const coordinates: { lat: number; lng: number }[] = (
    geometry['coordinates'] as unknown[]
  )
    .filter((c): c is [number, number] => Array.isArray(c) && c.length >= 2)
    .map(([lng, lat]) => ({ lat, lng }));

  return {
    coordinates,
    distanceKm: distanceM / 1000,
    durationSec,
  };
}
