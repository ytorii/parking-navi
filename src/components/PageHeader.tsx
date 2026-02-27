import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  onBack: () => void;
  backLabel?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({
  title,
  onBack,
  backLabel = '戻る',
  actions,
}: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-slate-800 px-4 py-3.5 shadow-md border-b border-slate-700">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-700 hover:text-slate-300 active:bg-slate-600"
          aria-label={backLabel}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <h1 className="flex-1 truncate text-base font-bold text-slate-100">{title}</h1>
        {actions}
      </div>
    </header>
  );
}
