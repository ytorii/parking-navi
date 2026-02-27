import { useEffect, useState } from 'react';
import { subscribeParkingLots } from '@/lib/parkingLots';
import type { ParkingLot } from '@/types/parkingLot';

export function useParkingLots() {
  const [lots, setLots] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeParkingLots((data) => {
      setLots(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { lots, loading };
}
