import { create } from 'zustand';
import type { TimeCapsule } from '../types';

interface TimeCapsuleStore {
  capsules: TimeCapsule[];
  currentCapsule: TimeCapsule | null;
  filterCategory: string | null;
  sortOrder: 'latest' | 'oldest';
  setCapsules: (capsules: TimeCapsule[]) => void;
  setCurrentCapsule: (capsule: TimeCapsule | null) => void;
  addCapsule: (capsule: TimeCapsule) => void;
  updateCapsule: (capsule: TimeCapsule) => void;
  deleteCapsule: (capsuleId: string) => void;
  setFilterCategory: (category: string | null) => void;
  setSortOrder: (order: 'latest' | 'oldest') => void;
  toggleFavorite: (capsuleId: string) => void;
}

export const useTimeCapsuleStore = create<TimeCapsuleStore>((set) => ({
  capsules: [],
  currentCapsule: null,
  filterCategory: null,
  sortOrder: 'latest',
  setCapsules: (capsules) => set({ capsules }),
  setCurrentCapsule: (capsule) => set({ currentCapsule: capsule }),
  addCapsule: (capsule) =>
    set((state) => ({ capsules: [...state.capsules, capsule] })),
  updateCapsule: (capsule) =>
    set((state) => ({
      capsules: state.capsules.map((c) =>
        c.capsule_id === capsule.capsule_id ? capsule : c
      ),
    })),
  deleteCapsule: (capsuleId) =>
    set((state) => ({
      capsules: state.capsules.filter((c) => c.capsule_id !== capsuleId),
    })),
  setFilterCategory: (category) => set({ filterCategory: category }),
  setSortOrder: (order) => set({ sortOrder: order }),
  toggleFavorite: (capsuleId) =>
    set((state) => ({
      capsules: state.capsules.map((c) =>
        c.capsule_id === capsuleId ? { ...c, is_favorite: !c.is_favorite } : c
      ),
    })),
}));
