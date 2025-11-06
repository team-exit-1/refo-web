import { create } from 'zustand';
import type { Elder } from '../types';

interface ElderStore {
  currentElder: Elder | null;
  elders: Elder[];
  setCurrentElder: (elder: Elder) => void;
  setElders: (elders: Elder[]) => void;
  addElder: (elder: Elder) => void;
}

export const useElderStore = create<ElderStore>((set) => ({
  currentElder: null,
  elders: [],
  setCurrentElder: (elder) => set({ currentElder: elder }),
  setElders: (elders) => set({ elders }),
  addElder: (elder) => set((state) => ({ elders: [...state.elders, elder] })),
}));
