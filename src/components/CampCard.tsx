import { useState } from 'react';
import { Link } from 'react-router';
import { Dog, Star, Trash2, Truck, Users } from 'lucide-react';

import { deleteCamp } from '@/lib/camps';
import { useAuth } from '@/hooks/useAuth';
import BookingModal from '@/components/BookingModal';
import type { Camp, Season } from '@/types/camp';

interface CampCardProps {
  camp: Camp;
}

const SEASON_LABELS: Record<Season, string> = {
  spring: '春',
  summer: '夏',
  autumn: '秋',
  winter: '冬',
};

export default function CampCard({ camp }: CampCardProps) {
  const { user } = useAuth();
  const [bookingOpen, setBookingOpen] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`「${camp.name}」を削除しますか？`)) return;
    try {
      await deleteCamp(camp.id);
    } catch {
      window.alert('削除に失敗しました。もう一度お試しください。');
    }
  };

  const handleBookingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookingOpen(true);
  };

  // camperVanAllowed / hasDogRun のどちらかが true の場合、features から重複を除外
  const extraFeatures = camp.features.filter(
    (f) =>
      !(camp.camperVanAllowed && f === 'キャンピングカーOK') &&
      !(camp.hasDogRun && f === 'ドッグランあり') &&
      f !== 'キャンピングカーOK' &&
      f !== 'ドッグランあり',
  );

  return (
    <>
      <article
        className="overflow-hidden rounded-[14px] border border-black/10 bg-white shadow-sm transition-shadow hover:shadow-md"
        aria-label={`${camp.name}`}
      >
        {/* ── 画像エリア（リンクラッパーからdeleteボタンを分離） ── */}
        <div className="relative h-48 overflow-hidden">
          <Link
            to={`/camps/${camp.id}`}
            className="block h-full"
            tabIndex={-1}
            aria-hidden="true"
          >
            {camp.imageUrls.length > 0 ? (
              <img
                src={camp.imageUrls[0]}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
                <svg viewBox="0 0 80 60" className="h-10 w-10 text-stone-300" fill="currentColor" aria-hidden="true">
                  <path d="M40 5 L70 50 H10 Z" opacity="0.6" />
                  <path d="M40 5 L65 45 H15 Z" opacity="0.3" />
                  <rect x="32" y="38" width="16" height="12" rx="2" />
                </svg>
              </div>
            )}
          </Link>

          {/* 左上: 特徴バッジ（Figmaカラー） */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 pointer-events-none">
            {camp.camperVanAllowed && (
              <span className="flex items-center gap-1 rounded-full bg-[rgba(21,93,252,0.9)] px-3 py-1 text-xs font-bold text-white shadow">
                <Truck className="h-3 w-3" aria-hidden="true" />
                キャンピングカーOK
              </span>
            )}
            {camp.hasDogRun && (
              <span className="flex items-center gap-1 rounded-full bg-[rgba(255,105,0,0.9)] px-3 py-1 text-xs font-bold text-white shadow">
                <Dog className="h-3 w-3" aria-hidden="true" />
                ドッグランあり
              </span>
            )}
            {/* featuresベース (boolean未設定の既存データ向け) */}
            {!camp.camperVanAllowed && camp.features.includes('キャンピングカーOK') && (
              <span className="flex items-center gap-1 rounded-full bg-[rgba(21,93,252,0.9)] px-3 py-1 text-xs font-bold text-white shadow">
                <Truck className="h-3 w-3" aria-hidden="true" />
                キャンピングカーOK
              </span>
            )}
            {!camp.hasDogRun && camp.features.includes('ドッグランあり') && (
              <span className="flex items-center gap-1 rounded-full bg-[rgba(255,105,0,0.9)] px-3 py-1 text-xs font-bold text-white shadow">
                <Dog className="h-3 w-3" aria-hidden="true" />
                ドッグランあり
              </span>
            )}
            {extraFeatures.slice(0, 1).map((f) => (
              <span key={f} className="flex items-center gap-1 rounded-full bg-[rgba(100,100,100,0.85)] px-3 py-1 text-xs font-bold text-white shadow">
                {f}
              </span>
            ))}
          </div>

          {/* 右上: タイプバッジ */}
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-[#1e2939] shadow pointer-events-none">
            {camp.type === 'glamping' ? 'グランピング' : 'キャンプ場'}
          </span>

          {/* 右下（認証ユーザー）: 削除ボタン — article の直接子として配置 */}
          {user && (
            <button
              type="button"
              onClick={handleDelete}
              className="absolute bottom-2 right-2 rounded-lg bg-white/80 p-1.5 text-stone-400 shadow-sm backdrop-blur-sm transition hover:bg-red-50 hover:text-red-500"
              aria-label={`${camp.name}を削除`}
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* ── カード本文 ── */}
        <div className="p-4">
          {/* 施設名（主リンク） */}
          <Link
            to={`/camps/${camp.id}`}
            className="text-lg font-bold leading-tight text-[#101828] hover:text-green-700 block"
          >
            {camp.name}
          </Link>

          {/* 場所 */}
          <p className="mt-1 flex items-center gap-1 text-sm text-[#4a5565]">
            <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 fill-[#4a5565]" aria-hidden="true">
              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
            </svg>
            {camp.location}
          </p>

          {/* 説明 */}
          {camp.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#4a5565]">
              {camp.description}
            </p>
          )}

          {/* 情報ボックス（グレー） */}
          {(camp.nearbyAttractions.length > 0 || camp.hasDogRun || camp.features.includes('ドッグランあり')) && (
            <div className="mt-3 rounded-[10px] bg-[#f9fafb] p-3 flex flex-col gap-2">
              {/* 周辺の遊び場 */}
              {camp.nearbyAttractions.length > 0 && (
                <div className="flex items-start gap-2">
                  <svg viewBox="0 0 16 16" className="mt-0.5 h-3.5 w-3.5 shrink-0 fill-[#4a5565]" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-xs font-semibold text-[#364153]">周辺の遊び場:</p>
                    <p className="text-xs text-[#4a5565]">
                      {camp.nearbyAttractions.slice(0, 2).join('、')}
                    </p>
                  </div>
                </div>
              )}

              {/* ドッグラン料金 */}
              {(camp.hasDogRun || camp.features.includes('ドッグランあり')) && (
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Dog className="h-3.5 w-3.5 shrink-0 text-[#4a5565]" aria-hidden="true" />
                    <p className="text-xs font-semibold text-[#364153]">ドッグラン:</p>
                  </div>
                  <p className="text-right text-xs font-medium text-[#4a5565]">
                    {camp.dogRunPrice && Object.values(camp.dogRunPrice).some(v => v)
                      ? `${camp.dogRunPrice.small ? `小${camp.dogRunPrice.small}` : ''}${camp.dogRunPrice.small && camp.dogRunPrice.medium ? '/' : ''}${camp.dogRunPrice.medium ? `中${camp.dogRunPrice.medium}` : ''}${(camp.dogRunPrice.small || camp.dogRunPrice.medium) && camp.dogRunPrice.large ? '/' : ''}${camp.dogRunPrice.large ? `大${camp.dogRunPrice.large}` : ''}${camp.dogRunPrice.general ? `一般${camp.dogRunPrice.general}` : ''}`
                      : '詳細はお問合せ'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 評価 + 定員 */}
          <div className="mt-3 flex items-center gap-4">
            {camp.rating !== null && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                <span className="text-sm font-medium text-[#0a0a0a]" aria-label={`評価 ${camp.rating.toFixed(1)}`}>{camp.rating.toFixed(1)}</span>
              </div>
            )}
            {camp.capacity !== null && (
              <div className="flex items-center gap-1 text-[#4a5565]">
                <Users className="h-4 w-4" aria-hidden="true" />
                <span className="text-sm">{camp.capacity}名</span>
              </div>
            )}
          </div>

          {/* 季節タグ */}
          {camp.seasons.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {camp.seasons.map((s) => (
                <span
                  key={s}
                  className="rounded-[8px] bg-[#dcfce7] px-2 py-1 text-xs font-medium text-[#016630]"
                >
                  {SEASON_LABELS[s]}
                </span>
              ))}
            </div>
          )}

          {/* 区切り線 + 料金・予約ボタン */}
          <div className="mt-3 flex items-center justify-between border-t border-[#f3f4f6] pt-3">
            <div>
              {camp.pricePerNight !== null ? (
                <>
                  <p className="text-xs text-[#6a7282]">料金目安</p>
                  <p className="text-lg font-bold text-[#008236]">
                    ¥{camp.pricePerNight.toLocaleString()}~/泊
                  </p>
                </>
              ) : (
                <p className="text-xs text-[#6a7282]">料金要確認</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleBookingClick}
              className="rounded-[8px] bg-[#00a63e] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-green-600 active:bg-green-700"
            >
              予約・空き状況
            </button>
          </div>
        </div>
      </article>

      <BookingModal
        campName={camp.name}
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </>
  );
}
