import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { elderApi, memoryApi, locationApi, timeCapsuleApi } from '../services/api';
import type { TimeCapsule } from '../types';

// Elder hooks
export const useElders = () => {
  return useQuery({
    queryKey: ['elders'],
    queryFn: elderApi.getElders,
  });
};

export const useElder = (elderId: string) => {
  return useQuery({
    queryKey: ['elder', elderId],
    queryFn: () => elderApi.getElder(elderId),
    enabled: !!elderId,
  });
};

// Memory hooks
export const useMemoryScores = (elderId: string) => {
  return useQuery({
    queryKey: ['memoryScores', elderId],
    queryFn: () => memoryApi.getMemoryScores(elderId),
    enabled: !!elderId,
  });
};

export const useCognitiveMetrics = (elderId: string) => {
  return useQuery({
    queryKey: ['cognitiveMetrics', elderId],
    queryFn: () => memoryApi.getCognitiveMetrics(elderId),
    enabled: !!elderId,
  });
};

export const useInteractionGuide = (elderId: string) => {
  return useQuery({
    queryKey: ['interactionGuide', elderId],
    queryFn: () => memoryApi.getInteractionGuide(elderId),
    enabled: !!elderId,
  });
};

// Location hooks
export const useCurrentLocation = (elderId: string) => {
  return useQuery({
    queryKey: ['currentLocation', elderId],
    queryFn: () => locationApi.getCurrentLocation(elderId),
    enabled: !!elderId,
    refetchInterval: 60000, // 1분마다 자동 갱신
  });
};

export const useLocationHistory = (elderId: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['locationHistory', elderId, startDate, endDate],
    queryFn: () => locationApi.getLocationHistory(elderId, startDate, endDate),
    enabled: !!elderId,
  });
};

// TimeCapsule hooks
export const useTimeCapsules = (elderId: string) => {
  return useQuery({
    queryKey: ['timeCapsules', elderId],
    queryFn: () => timeCapsuleApi.getTimeCapsules(elderId),
    enabled: !!elderId,
  });
};

export const useTimeCapsule = (capsuleId: string) => {
  return useQuery({
    queryKey: ['timeCapsule', capsuleId],
    queryFn: () => timeCapsuleApi.getTimeCapsule(capsuleId),
    enabled: !!capsuleId,
  });
};

export const useCreateTimeCapsule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (capsule: Omit<TimeCapsule, 'capsule_id'>) =>
      timeCapsuleApi.createTimeCapsule(capsule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeCapsules'] });
    },
  });
};

export const useUpdateTimeCapsule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (capsule: TimeCapsule) => timeCapsuleApi.updateTimeCapsule(capsule),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['timeCapsules'] });
      queryClient.invalidateQueries({ queryKey: ['timeCapsule', variables.capsule_id] });
    },
  });
};

export const useDeleteTimeCapsule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (capsuleId: string) => timeCapsuleApi.deleteTimeCapsule(capsuleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeCapsules'] });
    },
  });
};
