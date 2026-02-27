interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  message = '読み込み中...',
  fullScreen = true,
}: LoadingSpinnerProps) {
  const wrapper = fullScreen
    ? 'flex min-h-screen flex-col items-center justify-center bg-slate-900'
    : 'flex flex-col items-center py-20';

  return (
    <div className={wrapper}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />
      <p className="mt-3 text-sm text-slate-400">{message}</p>
    </div>
  );
}
