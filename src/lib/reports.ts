import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from './firebase/firestore';
import type { AvailabilityReport, AvailabilityReportPayload } from '@/types/parkingLot';

const reportsRef = (lotId: string) => collection(db, 'parkingLots', lotId, 'reports');

export function subscribeReports(
  lotId: string,
  onChange: (reports: AvailabilityReport[]) => void,
): () => void {
  const q = query(reportsRef(lotId), orderBy('createdAt', 'desc'), limit(20));
  return onSnapshot(q, (snapshot) => {
    const reports = snapshot.docs.map((d) => ({
      id: d.id,
      parkingLotId: lotId,
      ...d.data(),
    }) as unknown as AvailabilityReport);
    onChange(reports);
  });
}

export async function createReport(
  lotId: string,
  userId: string,
  userDisplayName: string,
  payload: AvailabilityReportPayload,
): Promise<string> {
  const ref = await addDoc(reportsRef(lotId), {
    ...payload,
    userId,
    userDisplayName,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}
