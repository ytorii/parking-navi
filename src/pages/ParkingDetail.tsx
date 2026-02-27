import { useNavigate, useParams } from 'react-router';
import { Edit2, MessageSquare } from 'lucide-react';
import { useParkingLot } from '@/hooks/useParkingLot';
import { useReports } from '@/hooks/useReports';
import { useAuth } from '@/hooks/useAuth';
import PageHeader from '@/components/PageHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import ParkingMap from '@/components/ParkingMap';
import ReportHistory from '@/components/ReportHistory';
import FacilityIcons from '@/components/FacilityIcons';
import { SectionHeader } from '@/components/SectionCard';

export default function ParkingDetail() {
  const navigate = useNavigate();
  const { parkingLotId = '' } = useParams();
  const { lot, loading, error } = useParkingLot(parkingLotId);
  const { reports, loading: reportsLoading } = useReports(parkingLotId);
  const { user } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!lot || error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900">
        <EmptyState
          icon={<div className="text-3xl">⚠️</div>}
          heading="駐車場が見つかりません"
          action={{ label: '一覧に戻る', onClick: () => navigate('/') }}
        />
      </div>
    );
  }

  const typeLabel: Record<string, string> = {
    sa: 'SA',
    pa: 'PA',
    'michi-no-eki': '道の駅',
    'truck-station': 'トラックステーション',
    private: '民間',
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <PageHeader
        title={lot.name}
        onBack={() => navigate('/')}
        actions={
          user && (
            <button
              type="button"
              onClick={() => navigate(`/parking/${parkingLotId}/edit`)}
              className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700 active:bg-blue-800"
            >
              <Edit2 className="h-4 w-4" aria-hidden="true" />
              編集
            </button>
          )
        }
      />

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        {/* 基本情報 */}
        <section className="rounded-lg border border-slate-700 bg-slate-800 p-4 space-y-3">
          <div>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-700 text-slate-300">
              {typeLabel[lot.type]}
            </span>
          </div>
          <div>
            <SectionHeader>所在地</SectionHeader>
            <p className="text-slate-200">{lot.address}</p>
            <p className="text-sm text-slate-400 mt-1">{lot.region}</p>
          </div>
          {lot.phone && (
            <div>
              <SectionHeader>電話番号</SectionHeader>
              <a href={`tel:${lot.phone}`} className="text-blue-400 hover:text-blue-300">
                {lot.phone}
              </a>
            </div>
          )}
          {lot.url && (
            <div>
              <SectionHeader>公式サイト</SectionHeader>
              <a href={lot.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                {lot.url}
              </a>
            </div>
          )}
          <div>
            <SectionHeader>料金</SectionHeader>
            {lot.isFree ? (
              <p className="text-green-400 font-medium">無料</p>
            ) : (
              <p className="text-slate-200">
                {lot.pricePerHour && <span>¥{lot.pricePerHour}/時間 </span>}
                {lot.pricePerNight && <span>¥{lot.pricePerNight}/泊</span>}
              </p>
            )}
          </div>
        </section>

        {/* 設備 */}
        <section className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <SectionHeader>設備</SectionHeader>
          <FacilityIcons facilities={lot.facilities} />
        </section>

        {/* 地図 */}
        <ParkingMap query={lot.address} label={lot.name} />

        {/* レポート投稿ボタン */}
        {user && (
          <button
            type="button"
            onClick={() => navigate(`/report/${parkingLotId}`)}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-base font-medium text-white transition hover:bg-blue-700 active:bg-blue-800"
          >
            <MessageSquare className="h-5 w-5" aria-hidden="true" />
            空き状況をレポート
          </button>
        )}

        {/* レポート履歴 */}
        <ReportHistory reports={reports} loading={reportsLoading} />
      </main>
    </div>
  );
}
