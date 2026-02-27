import { useEffect, useState } from 'react';
import { subscribeCamps } from '@/lib/camps';
import type { Camp } from '@/types/camp';

export function useCamps() {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeCamps((data) => {
      setCamps(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { camps, loading };
}
