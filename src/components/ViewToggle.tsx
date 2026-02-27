import { Map, List } from 'lucide-react';
import { clsx } from 'clsx';

interface ViewToggleProps {
  view: 'list' | 'map';
  onViewChange: (view: 'list' | 'map') => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-slate-800 border border-slate-700 p-1">
      <button
        type="button"
        onClick={() => onViewChange('list')}
        className={clsx(
          'flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition',
          view === 'list'
            ? 'bg-blue-600 text-white'
            : 'text-slate-400 hover:text-slate-200'
        )}
      >
        <List className="h-4 w-4" aria-hidden="true" />
        リスト
      </button>
      <button
        type="button"
        onClick={() => onViewChange('map')}
        className={clsx(
          'flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition',
          view === 'map'
            ? 'bg-blue-600 text-white'
            : 'text-slate-400 hover:text-slate-200'
        )}
      >
        <Map className="h-4 w-4" aria-hidden="true" />
        地図
      </button>
    </div>
  );
}
