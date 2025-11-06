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

  // 임시 데이터 (API 없을 때)
  const tempCapsule = {
    capsule_id: 'temp_1',
    elder_id: 'elder_1',
    created_date: '2024-01-15T10:30:00Z',
    title: '손주들과 함께한 설날 이야기',
    content: `올해 설날에는 온 가족이 모여서 정말 즐거운 시간을 보냈어요.\n\n아침 일찍 일어나서 떡국을 끓이는데, 손주들이 부엌까지 따라와서 "할머니, 저도 도와줄게요!" 하더라고요. 너무 귀여워서 웃음이 났어요.\n\n새해 복 많이 받으라고 세뱃돈을 주니까, 아이들이 깍듯이 절을 하는 모습이 정말 기특했어요. 요즘 아이들은 그런 거 잘 안 하는데 우리 손주들은 참 예의가 바른 것 같아요.\n\n점심에는 다 같이 윷놀이를 했는데, 제가 개걸 네 번이나 던져서 우승을 했답니다! 손주들이 "할머니 대박!" 하면서 좋아하더라고요.\n\n저녁에는 가족사진도 찍고, 옛날 앨범도 꺼내서 다 같이 봤어요. 제가 젊었을 때 사진을 보고 손주들이 깜짝 놀라더라고요. "할머니 진짜 예뻐요!" 하면서요.\n\n이렇게 온 가족이 모여서 웃고 떠드는 시간이 정말 소중한 것 같아요. 건강해서 이런 시간들을 더 많이 만들고 싶어요.`,
    conversation_id: 'conv_123',
    topic_category: '가족',
    emotion_tags: ['행복', '감사'],
    is_favorite: true,
  };

  const displayCapsule = capsule || tempCapsule;

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
                {new Date(displayCapsule.created_date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                })}
              </div>
              <h1 className="text-h1 font-bold text-neutral-gray-dark mb-4">
                {displayCapsule.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {displayCapsule.topic_category}
                </span>
                {displayCapsule.emotion_tags.map((tag) => (
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
                onClick={handleDelete}
                className="w-10 h-10 rounded-full bg-error/10 text-error hover:bg-error hover:text-white transition-all flex items-center justify-center"
              >
                <img src='/mdi_trashcan-outline.svg' alt="삭제" className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-8" />

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-body text-neutral-gray-dark leading-relaxed whitespace-pre-wrap">
              {displayCapsule.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
