import { clsx } from 'clsx';

interface FilterPillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function FilterPill({ label, isActive, onClick }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={clsx(
        'rounded-full px-4 py-1.5 text-sm font-medium transition',
        isActive
          ? 'bg-blue-600 text-white shadow-sm'
          : 'border border-slate-600 bg-slate-800 text-slate-300 hover:border-blue-500 hover:text-blue-400',
      )}
    >
      {label}
    </button>
  );
}
