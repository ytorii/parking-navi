import { clsx } from 'clsx';
import type { AvailabilityStatus } from '@/types/parkingLot';

interface StatusBadgeProps {
  status: AvailabilityStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<AvailabilityStatus, { label: string; className: string }> = {
  empty: { label: '空いている', className: 'bg-green-900 text-green-200' },
  moderate: { label: 'やや混雑', className: 'bg-yellow-900 text-yellow-200' },
  crowded: { label: '混雑中', className: 'bg-orange-900 text-orange-200' },
  full: { label: '満車', className: 'bg-red-900 text-red-200' },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClass = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }[size];

  return (
    <span className={clsx('rounded-full font-medium', config.className, sizeClass)}>
      {config.label}
    </span>
  );
}
