import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Route, Truck } from 'lucide-react';
import { useParkingLots } from '@/hooks/useParkingLots';
import { useAuth } from '@/hooks/useAuth';
import AuthButton from '@/components/AuthButton';
import ParkingLotCard from '@/components/ParkingLotCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import FilterPill from '@/components/FilterPill';
import type { ParkingLotType, Region } from '@/types/parkingLot';

const REGIONS: Region[] = ['広島', '岡山', '山口', '兵庫'];
const LOT_TYPES: { key: ParkingLotType | 'all'; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'sa', label: 'SA' },
  { key: 'pa', label: 'PA' },
  { key: 'michi-no-eki', label: '道の駅' },
  { key: 'truck-station', label: 'トラックステーション' },
  { key: 'private', label: '民間' },
];

export default function Explore() {
  const { lots, loading } = useParkingLots();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedType, setSelectedType] = useState<ParkingLotType | 'all'>('all');
  const [filterFree, setFilterFree] = useState(false);

  const filteredLots = useMemo(() => {
    return lots.filter((lot) => {
      const query = searchText.trim().toLowerCase();
      if (query && !lot.name.toLowerCase().includes(query) && !lot.address.toLowerCase().includes(query)) {
        return false;
      }
      if (selectedRegion && lot.region !== selectedRegion) return false;
      if (selectedType !== 'all' && lot.type !== selectedType) return false;
      if (filterFree && !lot.isFree) return false;
      return true;
    });
  }, [lots, searchText, selectedRegion, selectedType, filterFree]);

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="sticky top-0 z-10 bg-slate-800 border-b border-slate-700 px-4 py-3.5 shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-blue-400" aria-hidden="true" />
            <h1 className="text-lg font-bold text-slate-100">駐車ナビ</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:border-blue-500 hover:text-blue-400"
            >
              <Route className="h-4 w-4" aria-hidden="true" />
              ルート検索
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

      <div className="bg-slate-800 border-b border-slate-700 px-4 py-4">
        <input
          type="search"
          placeholder="駐車場名や住所で検索..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2.5 text-slate-100 placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="space-y-4 mb-6">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">地域</h2>
            <div className="flex flex-wrap gap-2">
              <FilterPill label="すべて" isActive={selectedRegion === null} onClick={() => setSelectedRegion(null)} />
              {REGIONS.map((r) => (
                <FilterPill
                  key={r}
                  label={r}
                  isActive={selectedRegion === r}
                  onClick={() => setSelectedRegion(r === selectedRegion ? null : r)}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">施設タイプ</h2>
            <div className="flex flex-wrap gap-2">
              {LOT_TYPES.map(({ key, label }) => (
                <FilterPill key={key} label={label} isActive={selectedType === key} onClick={() => setSelectedType(key)} />
              ))}
            </div>
          </div>

          <FilterPill label="無料のみ" isActive={filterFree} onClick={() => setFilterFree(!filterFree)} />
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-400">{filteredLots.length}件見つかりました</p>
        </div>

        {loading ? (
          <LoadingSpinner fullScreen={false} />
        ) : filteredLots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Truck className="h-16 w-16 text-slate-700 mb-4" aria-hidden="true" />
            <p className="text-base font-medium text-slate-300 mb-2">該当する駐車場がありません</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLots.map((lot) => (
              <li key={lot.id}>
                <ParkingLotCard lot={lot} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
