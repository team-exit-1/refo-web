import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateTimeCapsule } from '../../hooks/useApi';
import { useElderStore } from '../../stores/elderStore';

const categories = ['가족', '취미', '일상', '추억', '기타'];
const emotionTags = ['행복', '그리움', '평온', '기대', '감사', '설렘', '뿌듯함'];

export default function TimeCapsuleCreate() {
  const navigate = useNavigate();
  const currentElder = useElderStore((state) => state.currentElder);
  const createMutation = useCreateTimeCapsule();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCategory, setSelectedCategory] = useState('가족');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const handleEmotionToggle = (emotion: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion)
        ? prev.filter((e) => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentElder) {
      alert('어르신 정보가 없습니다.');
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    createMutation.mutate(
      {
        elder_id: currentElder.elder_id,
        created_date: selectedDate,
        title: title.trim(),
        content: content.trim(),
        topic_category: selectedCategory,
        emotion_tags: selectedEmotions,
        is_favorite: false,
      },
      {
        onSuccess: (newCapsule) => {
          navigate(`/timecapsule/${newCapsule.capsule_id}`);
        },
        onError: () => {
          alert('타임캡슐 생성에 실패했습니다.');
        },
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-h1 font-bold text-neutral-gray-dark">새 타임캡슐 만들기</h1>
        <p className="text-body text-neutral-gray-medium mt-1">
          소중한 순간을 기록하고 영원히 보존하세요
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="card p-6">
          <label className="block mb-2 font-semibold text-neutral-gray-dark">
            제목 <span className="text-error">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 손주와의 즐거운 시간"
            className="input-field w-full"
            required
          />
        </div>

        {/* Date */}
        <div className="card p-6">
          <label className="block mb-2 font-semibold text-neutral-gray-dark">
            날짜
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field"
          />
          <p className="text-sm text-neutral-gray-medium mt-2">
            과거의 대화를 기록하려면 날짜를 변경하세요
          </p>
        </div>

        {/* Category */}
        <div className="card p-6">
          <label className="block mb-3 font-semibold text-neutral-gray-dark">
            주제 카테고리
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-white scale-105'
                    : 'bg-gray-100 text-neutral-gray-medium hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Emotion Tags */}
        <div className="card p-6">
          <label className="block mb-3 font-semibold text-neutral-gray-dark">
            감정 태그
          </label>
          <div className="flex flex-wrap gap-2">
            {emotionTags.map((emotion) => (
              <button
                key={emotion}
                type="button"
                onClick={() => handleEmotionToggle(emotion)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedEmotions.includes(emotion)
                    ? 'bg-primary text-white scale-105'
                    : 'bg-gray-100 text-neutral-gray-medium hover:bg-gray-200'
                }`}
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="card p-6">
          <label className="block mb-2 font-semibold text-neutral-gray-dark">
            대화 내용 <span className="text-error">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘 나눈 대화나 경험을 자유롭게 기록해보세요..."
            className="input-field w-full min-h-[300px] resize-y"
            required
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-neutral-gray-medium">
              {content.length}자
            </span>
          </div>
        </div>

        {/* Voice Recording Info */}
        {isRecording && (
          <div className="card p-6 bg-error/10 border-error/30 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-error animate-pulse" />
              <span className="font-medium text-neutral-gray-dark">
                녹음 중... 완료되면 중지 버튼을 눌러주세요
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/timecapsule')}
            className="btn-secondary flex-1"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? '저장 중...' : '타임캡슐 저장'}
          </button>
        </div>
      </form>

      {/* Preview */}
      {title && content && (
        <div className="card p-6 bg-neutral-light">
          <h3 className="text-h3 font-semibold text-neutral-gray-dark mb-4">
            미리보기
          </h3>
          <div className="bg-white rounded-lg p-6">
            <div className="text-caption text-neutral-gray-medium mb-2">
              {new Date(selectedDate).toLocaleDateString('ko-KR')}
            </div>
            <h4 className="text-h2 font-bold text-neutral-gray-dark mb-3">
              {title}
            </h4>
            <p className="text-body text-neutral-gray-dark mb-4 whitespace-pre-wrap">
              {content}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {selectedCategory}
              </span>
              {selectedEmotions.map((emotion) => (
                <span
                  key={emotion}
                  className="text-sm px-3 py-1 rounded-full bg-gray-100 text-neutral-gray-dark font-medium"
                >
                  {emotion}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
