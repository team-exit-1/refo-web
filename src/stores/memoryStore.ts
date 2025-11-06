import { create } from 'zustand';
import type { MemoryScore, CognitiveMetrics, InteractionGuide } from '../types';

interface MemoryStore {
  memoryScores: MemoryScore[];
  cognitiveMetrics: CognitiveMetrics[];
  interactionGuide: InteractionGuide | null;
  setMemoryScores: (scores: MemoryScore[]) => void;
  setCognitiveMetrics: (metrics: CognitiveMetrics[]) => void;
  setInteractionGuide: (guide: InteractionGuide) => void;
  addMemoryScore: (score: MemoryScore) => void;
  addCognitiveMetric: (metric: CognitiveMetrics) => void;
}

export const useMemoryStore = create<MemoryStore>((set) => ({
  memoryScores: [],
  cognitiveMetrics: [],
  interactionGuide: null,
  setMemoryScores: (scores) => set({ memoryScores: scores }),
  setCognitiveMetrics: (metrics) => set({ cognitiveMetrics: metrics }),
  setInteractionGuide: (guide) => set({ interactionGuide: guide }),
  addMemoryScore: (score) =>
    set((state) => ({ memoryScores: [...state.memoryScores, score] })),
  addCognitiveMetric: (metric) =>
    set((state) => ({ cognitiveMetrics: [...state.cognitiveMetrics, metric] })),
}));
