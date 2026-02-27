import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase/firestore';
import type { ParkingLot, ParkingLotPayload } from '@/types/parkingLot';

const parkingLotsRef = () => collection(db, 'parkingLots');

export function subscribeParkingLots(onChange: (lots: ParkingLot[]) => void): () => void {
  const q = query(parkingLotsRef(), orderBy('updatedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const lots = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }) as unknown as ParkingLot);
    onChange(lots);
  });
}

export function subscribeParkingLot(
  lotId: string,
  onChange: (lot: ParkingLot | null) => void,
): () => void {
  return onSnapshot(doc(db, 'parkingLots', lotId), (d) => {
    onChange(
      d.exists()
        ? ({
            id: d.id,
            ...d.data(),
          } as unknown as ParkingLot)
        : null,
    );
  });
}

export async function createParkingLot(payload: ParkingLotPayload): Promise<string> {
  const ref = await addDoc(parkingLotsRef(), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateParkingLot(lotId: string, payload: ParkingLotPayload): Promise<void> {
  await updateDoc(doc(db, 'parkingLots', lotId), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteParkingLot(lotId: string): Promise<void> {
  await deleteDoc(doc(db, 'parkingLots', lotId));
}

export async function deleteAllParkingLots(): Promise<number> {
  const snapshot = await getDocs(parkingLotsRef());
  let count = 0;
  for (const d of snapshot.docs) {
    await deleteDoc(d.ref);
    count++;
  }
  return count;
}
