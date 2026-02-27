import { clsx } from 'clsx';

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionCard({ children, className }: SectionCardProps) {
  return (
    <section className={clsx('rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-sm', className)}>
      {children}
    </section>
  );
}

interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionHeader({ children, className }: SectionHeaderProps) {
  return (
    <h2 className={clsx('mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500', className)}>
      {children}
    </h2>
  );
}
