import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { useParkingLot } from '@/hooks/useParkingLot';
import { useAuth } from '@/hooks/useAuth';
import { createParkingLot, updateParkingLot } from '@/lib/parkingLots';
import PageHeader from '@/components/PageHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { ParkingLotPayload, ParkingLotType, Region, Facilities, GeoPoint } from '@/types/parkingLot';

export default function ParkingForm() {
  const navigate = useNavigate();
  const { parkingLotId } = useParams();
  const { lot, loading } = useParkingLot(parkingLotId || '');
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState<Region>('広島');
  const [type, setType] = useState<ParkingLotType>('truck-station');
  const [isFree, setIsFree] = useState(true);
  const [pricePerHour, setPricePerHour] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [phone, setPhone] = useState('');
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (lot) {
      setName(lot.name);
      setAddress(lot.address);
      setRegion(lot.region);
      setType(lot.type);
      setIsFree(lot.isFree);
      setPricePerHour(lot.pricePerHour?.toString() || '');
      setPricePerNight(lot.pricePerNight?.toString() || '');
      setPhone(lot.phone || '');
      setUrl(lot.url || '');
    }
  }, [lot]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const facilities: Facilities = {
        shower: false, toilet: true, convenienceStore: false, restaurant: false, laundry: false,
        vendingMachine: false, wifi: false, electricOutlet: false, gasStation: false,
        tirePressure: false, truckWash: false, sleepingArea: false,
      };

      const location: GeoPoint = { lat: 34.4, lng: 132.45 };

      const payload: ParkingLotPayload = {
        name, address, region, type, isFree,
        pricePerHour: isFree ? null : (pricePerHour ? parseInt(pricePerHour) : null),
        pricePerNight: isFree ? null : (pricePerNight ? parseInt(pricePerNight) : null),
        phone: phone || null, url: url || null, location, facilities,
        isOpen24Hours: false, imageUrls: [],
      };

      if (lot) {
        await updateParkingLot(lot.id, payload);
        toast.success('駐車場情報を更新しました');
        navigate(`/parking/${lot.id}`);
      } else {
        const id = await createParkingLot(payload);
        toast.success('駐車場を追加しました');
        navigate(`/parking/${id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && parkingLotId) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-900">
      <PageHeader title={parkingLotId ? "駐車場を編集" : "駐車場を追加"} onBack={() => navigate('/')} />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">駐車場名</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2.5 text-slate-100" />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-slate-300 mb-2">住所</label>
            <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2.5 text-slate-100" />
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium text-slate-300 mb-2">地域</label>
            <select id="region" value={region} onChange={(e) => setRegion(e.target.value as Region)}
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2.5 text-slate-100">
              <option>広島</option><option>岡山</option><option>山口</option><option>兵庫</option>
            </select>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-slate-300 mb-2">施設タイプ</label>
            <select id="type" value={type} onChange={(e) => setType(e.target.value as ParkingLotType)}
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2.5 text-slate-100">
              <option value="sa">SA</option><option value="pa">PA</option><option value="michi-no-eki">道の駅</option>
              <option value="truck-station">トラックステーション</option><option value="private">民間</option>
            </select>
          </div>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} />
            <span className="text-sm font-medium text-slate-300">無料</span>
          </label>

          {!isFree && (
            <>
              <div>
                <label htmlFor="pricePerHour" className="block text-sm font-medium text-slate-300 mb-2">時間料金（円）</label>
                <input id="pricePerHour" type="number" value={pricePerHour} onChange={(e) => setPricePerHour(e.target.value)}
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2.5 text-slate-100" />
              </div>
              <div>
                <label htmlFor="pricePerNight" className="block text-sm font-medium text-slate-300 mb-2">宿泊料金（円）</label>
                <input id="pricePerNight" type="number" value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)}
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2.5 text-slate-100" />
              </div>
            </>
          )}

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">電話番号</label>
            <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2.5 text-slate-100" />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-slate-300 mb-2">公式サイト</label>
            <input id="url" type="url" value={url} onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2.5 text-slate-100" />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={isSubmitting}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-base font-medium text-white hover:bg-blue-700">
              {isSubmitting ? '保存中...' : '保存'}
            </button>
            <button type="button" onClick={() => navigate(-1)}
              className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-base font-medium text-slate-300">
              キャンセル
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
