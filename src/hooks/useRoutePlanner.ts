import { useCallback, useState } from 'react';
import { useParkingLots } from '@/hooks/useParkingLots';
import { geocode, type GeocodingResult } from '@/lib/geocoding';
import { fetchRoute } from '@/lib/osrm';
import { haversineDistance, pointToPolylineResult } from '@/lib/routeUtils';
import type { Facilities, ParkingLot } from '@/types/parkingLot';

export interface RouteSearchParams {
  fromText: string;
  toText: string;
  maxDistanceKm: number;
  onlyLargeTruck: boolean;
  requiredFacilities: (keyof Facilities)[];
}

export interface RouteLot extends ParkingLot {
  distanceFromRoute: number;
  routePosition: number;
}

export interface RoutePlannerResult {
  lots: RouteLot[];
  fromPoint: GeocodingResult | null;
  toPoint: GeocodingResult | null;
  totalDistanceKm: number;
  routeGeometry: { lat: number; lng: number }[] | null;
  isRoadRoute: boolean;
  isGeocoding: boolean;
  isSearching: boolean;
  error: string | null;
  search: (params: RouteSearchParams) => Promise<void>;
  reset: () => void;
}

export function useRoutePlanner(): RoutePlannerResult {
  const { lots: allLots } = useParkingLots();

  const [resultLots, setResultLots] = useState<RouteLot[]>([]);
  const [fromPoint, setFromPoint] = useState<GeocodingResult | null>(null);
  const [toPoint, setToPoint] = useState<GeocodingResult | null>(null);
  const [totalDistanceKm, setTotalDistanceKm] = useState(0);
  const [routeGeometry, setRouteGeometry] = useState<{ lat: number; lng: number }[] | null>(null);
  const [isRoadRoute, setIsRoadRoute] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setResultLots([]);
    setFromPoint(null);
    setToPoint(null);
    setTotalDistanceKm(0);
    setRouteGeometry(null);
    setIsRoadRoute(false);
    setError(null);
  }, []);

  const search = useCallback(
    async (params: RouteSearchParams) => {
      setError(null);
      setResultLots([]);
      setRouteGeometry(null);
      setIsRoadRoute(false);

      // 1. ジオコーディング
      setIsGeocoding(true);
      let from: GeocodingResult;
      let to: GeocodingResult;
      try {
        // Nominatim のレート制限 (1req/sec) を考慮して順番に実行
        from = await geocode(params.fromText);
        await new Promise((r) => setTimeout(r, 1100));
        to = await geocode(params.toText);
      } catch (err) {
        setError(err instanceof Error ? err.message : '住所の検索に失敗しました');
        setIsGeocoding(false);
        return;
      }
      setFromPoint(from);
      setToPoint(to);
      setIsGeocoding(false);

      // 2. OSRM で道路経路を取得（失敗時は直線フォールバック）
      setIsSearching(true);
      const fromLatLng = { lat: from.lat, lng: from.lng };
      const toLatLng = { lat: to.lat, lng: to.lng };

      const osrmResult = await fetchRoute(fromLatLng, toLatLng);

      let geometry: { lat: number; lng: number }[];
      let distKm: number;
      let roadRoute: boolean;

      if (osrmResult) {
        geometry = osrmResult.coordinates;
        distKm = osrmResult.distanceKm;
        roadRoute = true;
      } else {
        // フォールバック: 直線2点
        geometry = [fromLatLng, toLatLng];
        distKm = haversineDistance(fromLatLng, toLatLng);
        roadRoute = false;
      }

      setRouteGeometry(geometry);
      setTotalDistanceKm(distKm);
      setIsRoadRoute(roadRoute);

      // 3. 距離計算 & フィルタ（ポリラインを使用）
      const filtered: RouteLot[] = allLots
        .map((lot) => {
          const p = { lat: lot.location.lat, lng: lot.location.lng };
          const { distanceKm, position } = pointToPolylineResult(p, geometry);
          return { ...lot, distanceFromRoute: distanceKm, routePosition: position };
        })
        .filter((lot) => {
          if (lot.distanceFromRoute > params.maxDistanceKm) return false;
          if (params.onlyLargeTruck && !lot.capacityLargeTruck) return false;
          for (const fac of params.requiredFacilities) {
            if (!lot.facilities[fac]) return false;
          }
          return true;
        })
        .sort((a, b) => a.routePosition - b.routePosition);

      setResultLots(filtered);
      setIsSearching(false);
    },
    [allLots],
  );

  return {
    lots: resultLots,
    fromPoint,
    toPoint,
    totalDistanceKm,
    routeGeometry,
    isRoadRoute,
    isGeocoding,
    isSearching,
    error,
    search,
    reset,
  };
}
