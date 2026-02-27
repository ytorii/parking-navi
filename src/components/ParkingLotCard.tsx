import { useNavigate } from 'react-router';
import { MapPin, Phone } from 'lucide-react';
import type { ParkingLot } from '@/types/parkingLot';

interface ParkingLotCardProps {
  lot: ParkingLot;
  latestStatus?: string;
}

export default function ParkingLotCard({ lot }: ParkingLotCardProps) {
  const navigate = useNavigate();

  const typeLabel: Record<string, string> = {
    sa: 'SA',
    pa: 'PA',
    'michi-no-eki': '道の駅',
    'truck-station': 'トラックステーション',
    private: '民間',
  };

  return (
    <button
      onClick={() => navigate(`/parking/${lot.id}`)}
      className="text-left rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-sm transition hover:border-blue-500 hover:shadow-md active:bg-slate-700"
    >
      {/* ヘッダー */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-700 text-slate-300">
              {typeLabel[lot.type]}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-100 line-clamp-2">{lot.name}</h3>
        </div>
      </div>

      {/* 住所 */}
      <div className="flex items-start gap-2 mb-3 text-sm text-slate-400">
        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
        <span className="line-clamp-1">{lot.address}</span>
      </div>

      {/* 電話番号 */}
      {lot.phone && (
        <div className="flex items-center gap-2 mb-3 text-sm text-slate-400">
          <Phone className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span>{lot.phone}</span>
        </div>
      )}

      {/* 価格 */}
      {!lot.isFree && (lot.pricePerHour || lot.pricePerNight) && (
        <div className="mb-3 text-sm text-slate-300">
          {lot.pricePerHour && <span>¥{lot.pricePerHour}/時間 </span>}
          {lot.pricePerNight && <span>¥{lot.pricePerNight}/泊</span>}
        </div>
      )}
      {lot.isFree && (
        <div className="mb-3 text-sm font-medium text-green-400">無料</div>
      )}

      {/* フッター */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-700">
        <span>{lot.region}</span>
        <span className="text-slate-600">詳細を見る →</span>
      </div>
    </button>
  );
}
