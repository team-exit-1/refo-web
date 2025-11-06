import { useState } from 'react';
import { useRoutines, useDeleteRoutine } from '../../hooks/useRoutine';
import RoutineCreateModal from './RoutineCreateModal';

const DAYS_ORDER = ['월', '화', '수', '목', '금', '토', '일'];

export default function RoutineList() {
  const { data, isLoading } = useRoutines();
  const deleteMutation = useDeleteRoutine();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleDelete = (id: number, title: string) => {
    if (window.confirm(`"${title}" 루틴을 삭제하시겠습니까?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-gray-medium">루틴을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold text-neutral-gray-dark">일상 루틴</h1>
          <p className="text-body text-neutral-gray-medium mt-1">
            규칙적인 생활을 위한 루틴을 관리하세요
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          + 새 루틴 추가
        </button>
      </div>

      {/* Stats */}
      

      {/* Routine List */}
      <div className="space-y-4">
        {data?.items && data.items.length > 0 ? (
          data.items.map((routine) => (
            <div
              key={routine.id}
              className="card p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-h3 font-semibold text-neutral-gray-dark">
                      {routine.title}
                    </h3>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                      {routine.times}
                    </span>
                  </div>
                  <p className="text-body text-neutral-gray-medium mb-3">
                    {routine.content}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {routine.day_of_week
                      .sort((a, b) => DAYS_ORDER.indexOf(a) - DAYS_ORDER.indexOf(b))
                      .map((day) => (
                        <span
                          key={day}
                          className="px-2 py-1 bg-neutral-light text-neutral-gray-dark text-xs rounded"
                        >
                          {day}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={() => handleDelete(routine.id, routine.title)}
                  className="ml-4 w-10 h-10 rounded-full bg-error/10 text-error hover:bg-error hover:text-white transition-all flex items-center justify-center"
                >
                  <img src='/mdi_trashcan-outline.svg' alt="삭제" className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-h3 font-semibold text-neutral-gray-dark mb-2">
              아직 루틴이 없습니다
            </h3>
            <p className="text-neutral-gray-medium mb-6">
              규칙적인 생활을 위한 루틴을 추가해보세요
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary"
            >
              첫 루틴 만들기
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <RoutineCreateModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
}
