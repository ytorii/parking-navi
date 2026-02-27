import { SectionHeader } from '@/components/SectionCard';
import StatusBadge from '@/components/StatusBadge';
import { formatTime } from '@/lib/time';
import type { AvailabilityReport } from '@/types/parkingLot';

interface ReportHistoryProps {
  reports: AvailabilityReport[];
  loading: boolean;
}

export default function ReportHistory({ reports, loading }: ReportHistoryProps) {
  if (loading) {
    return (
      <section className="rounded-lg border border-slate-700 bg-slate-800 p-4">
        <SectionHeader>最新レポート</SectionHeader>
        <div className="text-center py-8 text-slate-400">読み込み中...</div>
      </section>
    );
  }

  if (reports.length === 0) {
    return (
      <section className="rounded-lg border border-slate-700 bg-slate-800 p-4">
        <SectionHeader>最新レポート</SectionHeader>
        <div className="text-center py-8 text-slate-400">レポートはまだありません</div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-700 bg-slate-800 p-4">
      <SectionHeader>最新レポート</SectionHeader>
      <div className="space-y-3">
        {reports.slice(0, 5).map((report) => (
          <div key={report.id} className="flex items-start gap-3 p-3 rounded bg-slate-700/50">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge status={report.status} size="sm" />
                <span className="text-xs text-slate-500">{formatTime(report.createdAt)}</span>
              </div>
              <p className="text-sm text-slate-300 mb-1">{report.userDisplayName}</p>
              {report.comment && (
                <p className="text-sm text-slate-400 line-clamp-2">{report.comment}</p>
              )}
              {report.largeTruckSpaces !== undefined && (
                <p className="text-xs text-slate-500 mt-1">
                  大型車空き: {report.largeTruckSpaces}台
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
