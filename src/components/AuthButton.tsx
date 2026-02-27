import { clsx } from 'clsx';
import { useAuth } from '@/hooks/useAuth';

interface AuthButtonProps {
  variant?: 'light' | 'dark';
}

export default function AuthButton({ variant = 'dark' }: AuthButtonProps) {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const isDark = variant === 'dark';

  if (loading) return null;

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className={clsx('max-w-[120px] truncate text-sm', isDark ? 'text-slate-200' : 'text-slate-700')}>
          {user.displayName}
        </span>
        <button
          type="button"
          onClick={() => signOut()}
          className={clsx(
            'rounded-lg border px-3 py-1.5 text-xs font-semibold transition',
            isDark
              ? 'border-slate-600 text-slate-300 hover:bg-slate-700 active:bg-slate-800'
              : 'border-slate-300 text-slate-700 hover:bg-slate-100 active:bg-slate-200'
          )}
        >
          ログアウト
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signInWithGoogle()}
      className={clsx(
        'flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition',
        isDark
          ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
          : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100'
      )}
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      Google
    </button>
  );
}
