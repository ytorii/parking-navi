import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { createReport } from '@/lib/reports';
import PageHeader from '@/components/PageHeader';
import type { AvailabilityStatus } from '@/types/parkingLot';

const STATUS_OPTIONS: { value: AvailabilityStatus; label: string; color: string }[] = [
  { value: 'empty', label: '空いている', color: 'bg-green-900 text-green-200' },
  { value: 'moderate', label: 'やや混雑', color: 'bg-yellow-900 text-yellow-200' },
  { value: 'crowded', label: '混雑中', color: 'bg-orange-900 text-orange-200' },
  { value: 'full', label: '満車', color: 'bg-red-900 text-red-200' },
];

export default function ReportForm() {
  const navigate = useNavigate();
  const { parkingLotId = '' } = useParams();
  const { user } = useAuth();
  const [status, setStatus] = useState<AvailabilityStatus>('moderate');
  const [largeTruckSpaces, setLargeTruckSpaces] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await createReport(parkingLotId, user.uid, user.displayName || 'ユーザー', {
        status,
        largeTruckSpaces: largeTruckSpaces ? parseInt(largeTruckSpaces) : undefined,
        comment: comment || undefined,
      });
      toast.success('レポートを送信しました');
      navigate(`/parking/${parkingLotId}`);
    } catch (err) {
      console.error(err);
      toast.error('エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <PageHeader title="空き状況をレポート" onBack={() => navigate(`/parking/${parkingLotId}`)} />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-100 mb-4">現在の状況は？</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {STATUS_OPTIONS.map(({ value, label, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatus(value)}
                  className={`rounded-lg py-4 px-3 text-center font-medium transition ${
                    status === value
                      ? `${color} ring-2 ring-blue-500`
                      : 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="largeTruckSpaces" className="block text-sm font-medium text-slate-300 mb-2">
              大型車の空きスペース（台）
            </label>
            <input
              id="largeTruckSpaces"
              type="number"
              value={largeTruckSpaces}
              onChange={(e) => setLargeTruckSpaces(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2.5 text-slate-100"
            />
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-slate-300 mb-2">
              コメント（任意）
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="混雑の様子や駐車場の状態などを教えてください"
              rows={4}
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2.5 text-slate-100 placeholder-slate-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-base font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? '送信中...' : '送信'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-base font-medium text-slate-300"
            >
              キャンセル
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
