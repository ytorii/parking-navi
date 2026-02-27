import { useEffect, useState } from 'react';
import { subscribeCamp } from '@/lib/camps';
import type { Camp } from '@/types/camp';

export function useCamp(campId: string) {
  const [camp, setCamp] = useState<Camp | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeCamp(campId, (data) => {
      setCamp(data);
      setLoading(false);
      if (data === null) setError('キャンプ場が見つかりません');
    });
    return unsubscribe;
  }, [campId]);

  return { camp, loading, error };
}
