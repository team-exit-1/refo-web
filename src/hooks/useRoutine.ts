import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { routineApi } from '../services/api';
import type { RoutineCreateRequest } from '../types';

// 루틴 목록 조회
export function useRoutines() {
  return useQuery({
    queryKey: ['routines'],
    queryFn: () => routineApi.getRoutines(),
  });
}

// 루틴 생성
export function useCreateRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (routine: RoutineCreateRequest) => routineApi.createRoutine(routine),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    },
  });
}

// 루틴 삭제
export function useDeleteRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (routineId: number) => routineApi.deleteRoutine(routineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    },
  });
}
