import { Timestamp } from 'firebase/firestore';

export function toDatetimeLocal(ts: Timestamp): string {
  const d = ts.toDate();
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

export function fromDatetimeLocal(value: string): Timestamp {
  return Timestamp.fromDate(new Date(value));
}

export function nowDatetimeLocal(): string {
  return toDatetimeLocal(Timestamp.now());
}

export function formatTimestamp(ts: Timestamp): string {
  return ts.toDate().toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(ts: Timestamp): string {
  return ts.toDate().toLocaleDateString('ja-JP');
}

export function formatTime(ts: Timestamp): string {
  return ts.toDate().toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
