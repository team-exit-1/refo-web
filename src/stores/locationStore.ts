import { create } from 'zustand';
import type { LocationRecord } from '../types';

interface LocationStore {
  currentLocation: LocationRecord | null;
  locationHistory: LocationRecord[];
  safeZone: {
    center: { lat: number; lng: number };
    radius: number;
  } | null;
  setCurrentLocation: (location: LocationRecord) => void;
  setLocationHistory: (history: LocationRecord[]) => void;
  addLocationRecord: (record: LocationRecord) => void;
  setSafeZone: (zone: { center: { lat: number; lng: number }; radius: number }) => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  currentLocation: null,
  locationHistory: [],
  safeZone: null,
  setCurrentLocation: (location) => set({ currentLocation: location }),
  setLocationHistory: (history) => set({ locationHistory: history }),
  addLocationRecord: (record) =>
    set((state) => ({ locationHistory: [...state.locationHistory, record] })),
  setSafeZone: (zone) => set({ safeZone: zone }),
}));
