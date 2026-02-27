import { useEffect, useState } from 'react';
import { subscribeParkingLot } from '@/lib/parkingLots';
import type { ParkingLot } from '@/types/parkingLot';

export function useParkingLot(lotId: string) {
  const [lot, setLot] = useState<ParkingLot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeParkingLot(lotId, (data) => {
      setLot(data);
      setLoading(false);
      if (data === null) setError('駐車場が見つかりません');
    });
    return unsubscribe;
  }, [lotId]);

  return { lot, loading, error };
}
