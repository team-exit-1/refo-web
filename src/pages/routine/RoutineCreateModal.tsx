import { useState } from 'react';
import { useCreateRoutine } from '../../hooks/useRoutine';

interface RoutineCreateModalProps {
  onClose: () => void;
}

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

export default function RoutineCreateModal({ onClose }: RoutineCreateModalProps) {
  const createMutation = useCreateRoutine();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    times: '09:00',
    day_of_week: [] as string[],
  });

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      day_of_week: prev.day_of_week.includes(day)
        ? prev.day_of_week.filter((d) => d !== day)
        : [...prev.day_of_week, day],
    }));
  };

  // 시간단축 - 예시 값 자동 채우기
  const handleQuickFill = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 3); // 현재 시간 + 1분
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    setFormData({
      title: '아침 산책',
      content: '공원에서 가벼운 산책 30분',
      times: timeString,
      day_of_week: ['월', '수', '금'],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.day_of_week.length === 0) {
      alert('최소 하나의 요일을 선택해주세요.');
      return;
    }

    createMutation.mutate(formData, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        alert('루틴 생성에 실패했습니다.');
        console.error(error);
      },
    });
  };

  return (
    <div className="fixed top-0 left-0 inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full p-8 max-h-[100vh] overflow-y-auto relative">
        {/* 생성 중 오버레이 */}
        {createMutation.isPending && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-lg z-10">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-neutral-gray-dark font-semibold">루틴을 생성하는 중...</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h2 font-bold text-neutral-gray-dark">새 루틴 추가</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickFill}
              disabled={createMutation.isPending}
              className="px-3 py-1.5 text-sm font-medium bg-secondary-deep/10 text-secondary-deep rounded-lg hover:bg-secondary-deep/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⚡ 시간단축
            </button>
            <button
              onClick={onClose}
              disabled={createMutation.isPending}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold text-neutral-gray-dark mb-2">
              루틴 제목 <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="예) 아침 산책"
              required
              className="input-field w-full"
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-semibold text-neutral-gray-dark mb-2">
              상세 내용 <span className="text-error">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="예) 공원에서 가벼운 산책 30분"
              required
              rows={3}
              className="input-field w-full resize-none"
            />
          </div>

          {/* 시간 */}
          <div>
            <label className="block text-sm font-semibold text-neutral-gray-dark mb-2">
              알림 시간 <span className="text-error">*</span>
            </label>
            <input
              type="time"
              value={formData.times}
              onChange={(e) => setFormData({ ...formData, times: e.target.value })}
              required
              className="input-field w-full"
            />
          </div>

          {/* 요일 선택 */}
          <div>
            <label className="block text-sm font-semibold text-neutral-gray-dark mb-3">
              반복 요일 <span className="text-error">*</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    formData.day_of_week.includes(day)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-neutral-gray-medium hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            {formData.day_of_week.length > 0 && (
              <div className="mt-2 text-sm text-neutral-gray-medium">
                선택된 요일: {formData.day_of_week.join(', ')}
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={createMutation.isPending}
              className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {createMutation.isPending && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {createMutation.isPending ? '생성 중...' : '루틴 추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
