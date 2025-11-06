import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTimeCapsule, useDeleteTimeCapsule } from '../hooks/useApi';
import { useTimeCapsuleStore } from '../stores/timeCapsuleStore';

const emotionColors: Record<string, string> = {
  행복: 'bg-yellow-100 text-yellow-800',
  그리움: 'bg-purple-100 text-purple-800',
  평온: 'bg-blue-100 text-blue-800',
  기대: 'bg-green-100 text-green-800',
  감사: 'bg-pink-100 text-pink-800',
};

export default function TimeCapsuleDetail() {
  const { capsuleId } = useParams<{ capsuleId: string }>();
  const navigate = useNavigate();
  const { data: capsule, isLoading } = useTimeCapsule(capsuleId || '');
  const { toggleFavorite } = useTimeCapsuleStore();
  const deleteMutation = useDeleteTimeCapsule();

  const handleDelete = () => {
    if (window.confirm('정말 이 타임캡슐을 삭제하시겠습니까?')) {
      deleteMutation.mutate(capsuleId || '', {
        onSuccess: () => {
          navigate('/timecapsule');
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-gray-medium">타임캡슐을 열고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (!capsule) {
    return (
      <div className="text-center py-12">
        <h3 className="text-h3 font-semibold text-neutral-gray-dark mb-2">
          타임캡슐을 찾을 수 없습니다
        </h3>
        <Link to="/timecapsule" className="btn-primary mt-4">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        to="/timecapsule"
        className="inline-flex items-center gap-2 text-neutral-gray-medium hover:text-primary transition-colors"
      >
        <span>←</span>
        <span>목록으로</span>
      </Link>

      {/* Capsule Opening Animation Container */}
      <div className="card p-8 md:p-12 relative overflow-hidden animate-fadeIn">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary-medium/5 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="text-caption text-neutral-gray-medium mb-2">
                {new Date(capsule.created_date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                })}
              </div>
              <h1 className="text-h1 font-bold text-neutral-gray-dark mb-4">
                {capsule.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {capsule.topic_category}
                </span>
                {capsule.emotion_tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-sm px-3 py-1 rounded-full font-medium ${
                      emotionColors[tag] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => toggleFavorite(capsule.capsule_id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  capsule.is_favorite
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-neutral-gray-medium hover:bg-gray-200'
                }`}
              >
                {capsule.is_favorite ? '⭐' : '☆'}
              </button>
              <button
                onClick={handleDelete}
                className="w-10 h-10 rounded-full bg-error/10 text-error hover:bg-error hover:text-white transition-all flex items-center justify-center"
              >
                🗑️
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-8" />

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-body text-neutral-gray-dark leading-relaxed whitespace-pre-wrap">
              {capsule.content}
            </p>
          </div>

          {/* Audio Player (if exists) */}
          {capsule.conversation_id && (
            <div className="mt-8 p-6 bg-neutral-light rounded-lg">
              <h3 className="text-h3 font-semibold text-neutral-gray-dark mb-4">
                🎙️ 음성 녹음
              </h3>
              <div className="flex items-center gap-4">
                <button className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors">
                  ▶
                </button>
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-primary rounded-full w-0" />
                  </div>
                </div>
                <span className="text-sm text-neutral-gray-medium">0:00 / 0:00</span>
              </div>
            </div>
          )}

          {/* Keywords */}
          <div className="mt-8 p-6 bg-primary/5 rounded-lg">
            <h3 className="text-h3 font-semibold text-neutral-gray-dark mb-3">
              💡 주요 키워드
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white rounded-full text-sm text-neutral-gray-dark">
                #가족
              </span>
              <span className="px-3 py-1 bg-white rounded-full text-sm text-neutral-gray-dark">
                #손주
              </span>
              <span className="px-3 py-1 bg-white rounded-full text-sm text-neutral-gray-dark">
                #사진
              </span>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-8">
            <h3 className="text-h3 font-semibold text-neutral-gray-dark mb-3">
              📝 메모
            </h3>
            <textarea
              placeholder="이 순간에 대한 메모를 추가해보세요..."
              className="input-field w-full min-h-[100px] resize-y"
            />
            <button className="btn-secondary mt-2">메모 저장</button>
          </div>

          {/* Share Section */}
          <div className="mt-8 flex gap-3">
            <button className="btn-secondary flex-1">
              👨‍👩‍👧‍👦 가족과 공유
            </button>
            <button className="btn-secondary flex-1">
              💾 다운로드
            </button>
          </div>
        </div>
      </div>

      {/* Related Capsules */}
      <div className="card p-6">
        <h3 className="text-h3 font-semibold text-neutral-gray-dark mb-4">
          관련된 다른 캡슐
        </h3>
        <div className="text-sm text-neutral-gray-medium">
          같은 카테고리의 타임캡슐이 표시됩니다.
        </div>
      </div>
    </div>
  );
}
