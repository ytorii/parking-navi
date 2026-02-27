import { useEffect, useState } from 'react';
import { subscribeReports } from '@/lib/reports';
import type { AvailabilityReport } from '@/types/parkingLot';

export function useReports(lotId: string) {
  const [reports, setReports] = useState<AvailabilityReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeReports(lotId, (data) => {
      setReports(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [lotId]);

  return { reports, loading };
}
