interface DynamicListFieldProps {
  items: string[];
  maxItems: number;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
  inputType?: 'text' | 'url';
  placeholder: (index: number) => string;
  itemLabel: (index: number) => string;
  addButtonLabel: string;
  countLabel?: string;
}

export default function DynamicListField({
  items,
  maxItems,
  onAdd,
  onRemove,
  onUpdate,
  inputType = 'text',
  placeholder,
  itemLabel,
  addButtonLabel,
  countLabel,
}: DynamicListFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((value, index) => (
        <div key={`${value || 'empty'}-${index}`} className="flex items-center gap-2">
          <input
            type={inputType}
            value={value}
            onChange={(e) => onUpdate(index, e.target.value)}
            className="min-w-0 flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 placeholder-stone-300 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20"
            placeholder={placeholder(index)}
            aria-label={itemLabel(index)}
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="shrink-0 rounded-lg p-1.5 text-stone-300 transition hover:bg-rose-50 hover:text-rose-400 active:bg-rose-100"
              aria-label={`${itemLabel(index)} を削除`}
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          )}
        </div>
      ))}
      {items.length < maxItems && (
        <button
          type="button"
          onClick={onAdd}
          className="mt-1 flex items-center gap-1.5 rounded-xl border border-dashed border-stone-200 py-2 text-xs font-medium text-stone-400 transition hover:border-green-400 hover:text-green-600 active:bg-green-50"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          {addButtonLabel}
        </button>
      )}
      {countLabel && (
        <span className="text-right text-xs text-stone-300">{countLabel}</span>
      )}
    </div>
  );
}
