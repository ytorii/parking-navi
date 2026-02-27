import { Timestamp } from 'firebase/firestore';

export type ParkingLotType = 'sa' | 'pa' | 'michi-no-eki' | 'truck-station' | 'private';
export type Region = '広島' | '岡山' | '山口' | '兵庫';

export interface Facilities {
  shower: boolean;
  toilet: boolean;
  convenienceStore: boolean;
  restaurant: boolean;
  laundry: boolean;
  vendingMachine: boolean;
  wifi: boolean;
  electricOutlet: boolean;
  gasStation: boolean;
  tirePressure: boolean;
  truckWash: boolean;
  sleepingArea: boolean;
}

export interface RouteInfo {
  highwayName?: string;
  routeNumber?: string;
  direction?: string;
  nearestIC?: string;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface ParkingLot {
  id: string;
  name: string;
  type: ParkingLotType;
  location: GeoPoint;
  address: string;
  region: Region;
  routeInfo?: RouteInfo;
  capacityTotal?: number;
  capacityLargeTruck?: number;
  pricePerHour?: number | null;
  pricePerNight?: number | null;
  isFree: boolean;
  facilities: Facilities;
  operatingHours?: string;
  isOpen24Hours: boolean;
  phone?: string | null;
  url?: string | null;
  imageUrls: string[];
  description?: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

export interface ParkingLotPayload {
  name: string;
  type: ParkingLotType;
  location: GeoPoint;
  address: string;
  region: Region;
  routeInfo?: RouteInfo;
  capacityTotal?: number;
  capacityLargeTruck?: number;
  pricePerHour?: number | null;
  pricePerNight?: number | null;
  isFree: boolean;
  facilities: Facilities;
  operatingHours?: string;
  isOpen24Hours: boolean;
  phone?: string | null;
  url?: string | null;
  imageUrls: string[];
  description?: string | null;
}

export type AvailabilityStatus = 'empty' | 'moderate' | 'crowded' | 'full';

export interface AvailabilityReport {
  id: string;
  parkingLotId: string;
  status: AvailabilityStatus;
  largeTruckSpaces?: number;
  comment?: string;
  userId: string;
  userDisplayName: string;
  createdAt: Timestamp;
}

export interface AvailabilityReportPayload {
  status: AvailabilityStatus;
  largeTruckSpaces?: number;
  comment?: string;
}
