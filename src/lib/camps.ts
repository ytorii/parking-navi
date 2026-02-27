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
import type { Camp, CampPayload } from '@/types/camp';

const campsRef = () => collection(db, 'camps');

export function subscribeCamps(onChange: (camps: Camp[]) => void): () => void {
  const q = query(campsRef(), orderBy('updatedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const camps = snapshot.docs.map((d) => ({
      imageUrls: [],
      features: [],
      seasons: [],
      nearbyAttractions: [],
      phone: null,
      businessHours: null,
      type: 'campsite',
      region: null,
      description: null,
      pricePerNight: null,
      rating: null,
      capacity: null,
      camperVanAllowed: false,
      hasDogRun: false,
      dogRunPrice: null,
      dogRunInfo: null,
      id: d.id,
      ...d.data(),
    }) as unknown as Camp);
    onChange(camps);
  });
}

export function subscribeCamp(
  campId: string,
  onChange: (camp: Camp | null) => void,
): () => void {
  return onSnapshot(doc(db, 'camps', campId), (d) => {
    onChange(
      d.exists()
        ? ({
            imageUrls: [],
            features: [],
            seasons: [],
            nearbyAttractions: [],
            phone: null,
            businessHours: null,
            type: 'campsite',
            region: null,
            description: null,
            pricePerNight: null,
            rating: null,
            capacity: null,
            camperVanAllowed: false,
            hasDogRun: false,
            dogRunPrice: null,
            dogRunInfo: null,
            id: d.id,
            ...d.data(),
          } as unknown as Camp)
        : null,
    );
  });
}

export async function createCamp(payload: CampPayload): Promise<string> {
  const ref = await addDoc(campsRef(), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateCamp(campId: string, payload: CampPayload): Promise<void> {
  await updateDoc(doc(db, 'camps', campId), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCamp(campId: string): Promise<void> {
  await deleteDoc(doc(db, 'camps', campId));
}

// シードデータをすべて削除
export async function deleteAllCamps(): Promise<number> {
  const snapshot = await getDocs(campsRef());
  let count = 0;
  for (const d of snapshot.docs) {
    await deleteDoc(d.ref);
    count++;
  }
  return count;
}
