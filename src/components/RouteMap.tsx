import { useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router';
import L from 'leaflet';
import type { LatLngBoundsExpression, LatLngExpression } from 'leaflet';
import { MapPin, Navigation, ParkingCircle } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

interface RouteMapLot {
  id: string;
  name: string;
  type: string;
  location: { lat: number; lng: number };
  distanceFromRoute: number;
}

interface RouteMapProps {
  from: { lat: number; lng: number; label: string };
  to: { lat: number; lng: number; label: string };
  lots: RouteMapLot[];
  routeGeometry?: { lat: number; lng: number }[];
}

function createDivIcon(IconComponent: typeof MapPin, color: string) {
  const html = renderToStaticMarkup(
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: '50%',
        backgroundColor: color,
        border: '2px solid white',
        boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
      }}
    >
      <IconComponent size={16} color="white" />
    </div>,
  );
  return L.divIcon({
    html,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

const fromIcon = createDivIcon(MapPin, '#22c55e');
const toIcon = createDivIcon(Navigation, '#ef4444');
const lotIcon = createDivIcon(ParkingCircle, '#3b82f6');

export default function RouteMap({ from, to, lots, routeGeometry }: RouteMapProps) {
  const navigate = useNavigate();

  const routeLine = useMemo<LatLngExpression[]>(() => {
    if (routeGeometry && routeGeometry.length >= 2) {
      return routeGeometry.map((p) => [p.lat, p.lng]);
    }
    return [
      [from.lat, from.lng],
      [to.lat, to.lng],
    ];
  }, [routeGeometry, from, to]);

  const isRoadRoute = routeGeometry !== undefined && routeGeometry.length >= 2;

  const bounds = useMemo<LatLngBoundsExpression>(() => {
    const allPoints: [number, number][] = [
      [from.lat, from.lng],
      [to.lat, to.lng],
      ...lots.map((lot) => [lot.location.lat, lot.location.lng] as [number, number]),
    ];

    // ルートジオメトリのサンプル点を bounds に含める（均等サンプリング）
    if (routeGeometry && routeGeometry.length > 2) {
      const step = Math.max(1, Math.floor(routeGeometry.length / 10));
      for (let i = 0; i < routeGeometry.length; i += step) {
        allPoints.push([routeGeometry[i].lat, routeGeometry[i].lng]);
      }
    }

    const latMin = Math.min(...allPoints.map((p) => p[0]));
    const latMax = Math.max(...allPoints.map((p) => p[0]));
    const lngMin = Math.min(...allPoints.map((p) => p[1]));
    const lngMax = Math.max(...allPoints.map((p) => p[1]));
    const pad = 0.05;
    return [
      [latMin - pad, lngMin - pad],
      [latMax + pad, lngMax + pad],
    ];
  }, [from, to, lots, routeGeometry]);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-700">
      <MapContainer
        bounds={bounds}
        scrollWheelZoom={true}
        style={{ height: 300, width: '100%' }}
        className="sm:[&]:h-[400px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <Polyline
          positions={routeLine}
          pathOptions={{
            color: '#3b82f6',
            weight: 3,
            opacity: 0.85,
            ...(isRoadRoute ? {} : { dashArray: '8 6' }),
          }}
        />

        <Marker position={[from.lat, from.lng]} icon={fromIcon}>
          <Popup>
            <span className="text-sm font-medium">{from.label}</span>
          </Popup>
        </Marker>

        <Marker position={[to.lat, to.lng]} icon={toIcon}>
          <Popup>
            <span className="text-sm font-medium">{to.label}</span>
          </Popup>
        </Marker>

        {lots.map((lot) => (
          <Marker key={lot.id} position={[lot.location.lat, lot.location.lng]} icon={lotIcon}>
            <Popup>
              <div className="min-w-[160px]">
                <p className="text-sm font-bold mb-1">{lot.name}</p>
                <p className="text-xs text-gray-600 mb-2">
                  ルートから {lot.distanceFromRoute.toFixed(1)} km
                </p>
                <button
                  type="button"
                  onClick={() => navigate(`/parking/${lot.id}`)}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  詳細を見る
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
