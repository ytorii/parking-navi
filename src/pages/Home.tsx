import { useState } from 'react';
import { useNavigate } from 'react-router';
import { List, MapPin, Navigation, Plus, Search, Truck } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '@/hooks/useAuth';
import { useRoutePlanner } from '@/hooks/useRoutePlanner';
import AuthButton from '@/components/AuthButton';
import FilterPill from '@/components/FilterPill';
import LoadingSpinner from '@/components/LoadingSpinner';
import ParkingLotCard from '@/components/ParkingLotCard';
import RouteMap from '@/components/RouteMap';
import type { Facilities } from '@/types/parkingLot';

const INTERVAL_OPTIONS = [50, 100, 150, 200] as const;

const FACILITY_OPTIONS: { key: keyof Facilities; label: string }[] = [
  { key: 'shower', label: 'シャワー' },
  { key: 'restaurant', label: '食堂' },
  { key: 'convenienceStore', label: 'コンビニ' },
  { key: 'laundry', label: 'ランドリー' },
  { key: 'gasStation', label: 'ガソリンスタンド' },
  { key: 'wifi', label: 'Wi-Fi' },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lots, fromPoint, toPoint, totalDistanceKm, routeGeometry, isRoadRoute, isGeocoding, isSearching, error, search, reset } =
    useRoutePlanner();

  const [fromText, setFromText] = useState('');
  const [toText, setToText] = useState('');
  const maxDistanceKm = 10; // 固定値
  const [intervalKm, setIntervalKm] = useState<(typeof INTERVAL_OPTIONS)[number]>(100);
  const [onlyLargeTruck, setOnlyLargeTruck] = useState(false);
  const [requiredFacilities, setRequiredFacilities] = useState<(keyof Facilities)[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const isLoading = isGeocoding || isSearching;

  function toggleFacility(key: keyof Facilities) {
    setRequiredFacilities((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key],
    );
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!fromText.trim() || !toText.trim()) return;
    setHasSearched(true);
    await search({ fromText, toText, maxDistanceKm, intervalKm, onlyLargeTruck, requiredFacilities });
  }

  function handleReset() {
    setFromText('');
    setToText('');
    setIntervalKm(100);
    setOnlyLargeTruck(false);
    setRequiredFacilities([]);
    setHasSearched(false);
    reset();
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-slate-800 border-b border-slate-700 px-4 py-3.5 shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-blue-400" aria-hidden="true" />
            <h1 className="text-lg font-bold text-slate-100">駐車ナビ</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/explore')}
              className="flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:border-blue-500 hover:text-blue-400"
            >
              <List className="h-4 w-4" aria-hidden="true" />
              一覧
            </button>
            {user && (
              <button
                type="button"
                onClick={() => navigate('/parking/new')}
                className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700 active:bg-blue-800"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                追加
              </button>
            )}
            <AuthButton variant="dark" />
          </div>
        </div>
      </header>

      {/* 検索フォーム */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-4">
        <form onSubmit={handleSearch} className="space-y-3">
          {/* 出発地 */}
          <div>
            <label htmlFor="from" className="block text-xs font-medium text-slate-400 mb-1">
              出発地
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" aria-hidden="true" />
              <input
                id="from"
                type="text"
                placeholder="例: 広島市"
                value={fromText}
                onChange={(e) => setFromText(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-700 pl-9 pr-4 py-2.5 text-slate-100 placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* 目的地 */}
          <div>
            <label htmlFor="to" className="block text-xs font-medium text-slate-400 mb-1">
              目的地
            </label>
            <div className="relative">
              <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" aria-hidden="true" />
              <input
                id="to"
                type="text"
                placeholder="例: 神戸市"
                value={toText}
                onChange={(e) => setToText(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-700 pl-9 pr-4 py-2.5 text-slate-100 placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* 休憩間隔 */}
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1.5">休憩間隔</p>
            <div className="flex gap-2">
              {INTERVAL_OPTIONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIntervalKm(i)}
                  aria-pressed={intervalKm === i}
                  className={clsx(
                    'flex-1 rounded-lg py-1.5 text-sm font-medium transition',
                    intervalKm === i
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-600 bg-slate-700 text-slate-300 hover:border-blue-500',
                  )}
                >
                  {i}km
                </button>
              ))}
            </div>
          </div>

          {/* 大型車フィルタ */}
          <div className="flex items-center gap-3">
            <input
              id="large-truck"
              type="checkbox"
              checked={onlyLargeTruck}
              onChange={(e) => setOnlyLargeTruck(e.target.checked)}
              className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-800"
            />
            <label htmlFor="large-truck" className="flex items-center gap-1.5 text-sm text-slate-300 cursor-pointer">
              <Truck className="h-4 w-4 text-slate-400" aria-hidden="true" />
              大型車スペースあり
            </label>
          </div>

          {/* 施設フィルタ */}
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1.5">必要な設備</p>
            <div className="flex flex-wrap gap-2">
              {FACILITY_OPTIONS.map(({ key, label }) => (
                <FilterPill
                  key={key}
                  label={label}
                  isActive={requiredFacilities.includes(key)}
                  onClick={() => toggleFacility(key)}
                />
              ))}
            </div>
          </div>

          {/* 検索ボタン */}
          <button
            type="submit"
            disabled={isLoading || !fromText.trim() || !toText.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            検索
          </button>
        </form>
      </div>

      {/* 注意書き */}
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <p className="text-xs text-slate-500 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700">
          {isRoadRoute
            ? '※ 道路経路はOSRM（OpenStreetMap）を使用しています。住所検索はNominatimを使用しています。'
            : '※ ルートは直線近似です。実際の道路経路とは異なる場合があります。住所検索はOpenStreetMap Nominatimを使用しています。'}
        </p>
      </div>

      {/* 結果 */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        {isLoading && (
          <div className="space-y-2">
            <LoadingSpinner fullScreen={false} message={isGeocoding ? '住所を検索中...' : '駐車場を絞り込み中...'} />
          </div>
        )}

        {error && !isLoading && (
          <div role="alert" className="rounded-lg bg-red-900/50 border border-red-700 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {!isLoading && !error && fromPoint && toPoint && (
          <div className="space-y-4">
            {/* 地図 */}
            <RouteMap
              from={{ lat: fromPoint.lat, lng: fromPoint.lng, label: fromPoint.displayName.split(',')[0] }}
              to={{ lat: toPoint.lat, lng: toPoint.lng, label: toPoint.displayName.split(',')[0] }}
              lots={lots.map((lot) => ({
                id: lot.id,
                name: lot.name,
                type: lot.type,
                location: lot.location,
                distanceFromRoute: lot.distanceFromRoute,
              }))}
              routeGeometry={routeGeometry ?? undefined}
            />

            {/* ルート情報ヘッダー */}
            <div className="rounded-lg bg-slate-800 border border-slate-700 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-slate-300 mb-1">
                <MapPin className="h-4 w-4 text-green-400 flex-shrink-0" aria-hidden="true" />
                <span className="line-clamp-1">{fromPoint.displayName.split(',')[0]}</span>
              </div>
              <div className="ml-4 border-l-2 border-slate-600 my-1 h-3" />
              <div className="flex items-center gap-2 text-sm text-slate-300 mb-2">
                <Navigation className="h-4 w-4 text-blue-400 flex-shrink-0" aria-hidden="true" />
                <span className="line-clamp-1">{toPoint.displayName.split(',')[0]}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-700">
                <span>{isRoadRoute ? 'ルート距離' : '直線距離'}: {totalDistanceKm.toFixed(0)} km</span>
                <span>{lots.length} 件の駐車場が見つかりました</span>
              </div>
            </div>

            {/* 結果リスト */}
            {lots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Truck className="h-12 w-12 text-slate-700 mb-3" aria-hidden="true" />
                <p className="text-sm font-medium text-slate-300 mb-1">該当する駐車場がありません</p>
                <p className="text-xs text-slate-500">検索条件を変えてお試しください</p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-4 text-xs text-blue-400 hover:text-blue-300 underline"
                >
                  条件をリセット
                </button>
              </div>
            ) : (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {lots.map((lot, index) => (
                  <li key={lot.id}>
                    {/* ルート位置インジケーター */}
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">#{index + 1}</span>
                      <div className="flex-1 h-1 rounded-full bg-slate-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${Math.round(lot.routePosition * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{Math.round(lot.routePosition * 100)}%</span>
                      <span className="text-xs text-slate-500 ml-1">
                        ルートから {lot.distanceFromRoute.toFixed(1)}km
                      </span>
                    </div>
                    <ParkingLotCard lot={lot} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {!isLoading && !error && !hasSearched && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Truck className="h-16 w-16 text-slate-700 mb-4" aria-hidden="true" />
            <p className="text-sm font-medium text-slate-300 mb-1">出発地と目的地を入力してください</p>
            <p className="text-xs text-slate-500">ルート沿いの駐車場・SA・PAを表示します</p>
          </div>
        )}
      </main>
    </div>
  );
}
