import {
  Droplet,
  UtensilsCrossed,
  Wifi,
  Zap,
  Lightbulb,
  Waves,
  ShoppingCart,
  Wind,
  Bed,
} from 'lucide-react';
import type { Facilities } from '@/types/parkingLot';

interface FacilityIconsProps {
  facilities: Facilities;
}

export default function FacilityIcons({ facilities }: FacilityIconsProps) {
  const items = [
    { key: 'shower', label: 'シャワー', icon: Droplet },
    { key: 'toilet', label: 'トイレ', icon: Lightbulb },
    { key: 'restaurant', label: 'レストラン', icon: UtensilsCrossed },
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'electricOutlet', label: 'コンセント', icon: Zap },
    { key: 'truckWash', label: 'トラック洗車', icon: Waves },
    { key: 'vendingMachine', label: '自販機', icon: ShoppingCart },
    { key: 'tirePressure', label: 'タイヤ空気', icon: Wind },
    { key: 'sleepingArea', label: '仮眠室', icon: Bed },
  ] as const;

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
      {items.map(({ key, label, icon: Icon }) => {
        const hasIt = facilities[key as keyof Facilities];
        return (
          <div
            key={key}
            className={`flex flex-col items-center gap-1 rounded-lg p-2 ${
              hasIt ? 'bg-blue-900/30 text-blue-300' : 'bg-slate-700/30 text-slate-500'
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs text-center">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
