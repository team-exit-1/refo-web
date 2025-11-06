import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Radar, Line, Bar } from 'react-chartjs-2';
import { useMemoryScores, useCognitiveMetrics, useInteractionGuide } from '../hooks/useApi';
import { useElderStore } from '../stores/elderStore';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function Dashboard() {
  const currentElder = useElderStore((state) => state.currentElder);
  const { data: memoryScores } = useMemoryScores(currentElder?.elder_id || '');
  const { data: cognitiveMetrics } = useCognitiveMetrics(currentElder?.elder_id || '');
  const { data: interactionGuide } = useInteractionGuide(currentElder?.elder_id || '');

  const latestMemoryScore = memoryScores?.[0];

  // 레이더 차트 데이터 (기억 유지 지수)
  const radarData = {
    labels: ['가족', '직업/경력', '취미/관심사', '생애 사건'],
    datasets: [
      {
        label: '기억 강도',
        data: latestMemoryScore
          ? [
              latestMemoryScore.topic_scores.family,
              latestMemoryScore.topic_scores.career,
              latestMemoryScore.topic_scores.hobbies,
              latestMemoryScore.topic_scores.life_events,
            ]
          : [0, 0, 0, 0],
        backgroundColor: 'rgba(174, 147, 223, 0.2)',
        borderColor: 'rgba(174, 147, 223, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(174, 147, 223, 1)',
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // 라인 차트 데이터 (인지 기능 변화)
  const lineData = {
    labels: cognitiveMetrics?.map((m) => m.date) || [],
    datasets: [
      {
        label: '문장 길이',
        data: cognitiveMetrics?.map((m) => m.sentence_length) || [],
        borderColor: 'rgba(174, 147, 223, 1)',
        backgroundColor: 'rgba(174, 147, 223, 0.1)',
        tension: 0.4,
      },
      {
        label: '어휘 다양성',
        data: cognitiveMetrics?.map((m) => m.word_diversity) || [],
        borderColor: 'rgba(102, 103, 179, 1)',
        backgroundColor: 'rgba(102, 103, 179, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // 막대 그래프 데이터 (대화 흐름)
  const barData = {
    labels: cognitiveMetrics?.map((m) => m.date) || [],
    datasets: [
      {
        label: '발화 속도 (단어/분)',
        data: cognitiveMetrics?.map((m) => m.speech_rate) || [],
        backgroundColor: 'rgba(137, 125, 201, 0.8)',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card overflow-hidden">
        <div className="relative bg-gradient-to-r from-primary/20 via-secondary-medium/20 to-primary/10 p-8">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div>
                <h1 className="text-h1 font-bold text-neutral-gray-dark">
                  안녕하세요, 사용자님!
                </h1>
                <p className="text-body text-neutral-gray-medium mt-1">
                  오늘도 사용자님과 함께하는 소중한 하루입니다
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-caption text-neutral-gray-medium mb-1">전체 기억 점수</div>
                    <div className="text-h2 font-bold text-primary">
                      {latestMemoryScore?.overall_score.toFixed(1) || '0'}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <img src="/lucide_brain.svg" alt="뇌" className="w-7 h-7" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-caption text-neutral-gray-medium mb-1">타임캡슐</div>
                    <div className="text-h2 font-bold text-secondary-deep">
                      {/* TODO: 실제 타임캡슐 개수로 변경 */}
                      12개
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-secondary-deep/10 flex items-center justify-center">
                    <img src="/mingcute_time-line.svg" alt="타임캡슐" className="w-7 h-7" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-caption text-neutral-gray-medium mb-1">마지막 대화</div>
                    <div className="text-h2 font-bold text-secondary-deep">
                      {/* TODO: 실제 마지막 대화 시간으로 변경 */}
                      2시간 전
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                    <img src="/f7_ellipses-bubble.svg" alt="대화" className="w-7 h-7" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-medium/5 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h2 font-bold text-neutral-gray-dark">
            인지·언어 상태 분석
          </h2>
          <p className="text-body text-neutral-gray-medium mt-1">
            {currentElder?.name}님의 건강 상태를 한눈에 확인하세요
          </p>
        </div>
      </div>

      {/* 기억 유지 지수 */}
      <div className="card p-6">
        <h2 className="text-h2 font-semibold text-neutral-gray-dark mb-4">
          기억 유지 지수
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              {latestMemoryScore && (
                <>
                  <ScoreItem
                    label="가족 관련 기억"
                    score={latestMemoryScore.topic_scores.family}
                  />
                  <ScoreItem
                    label="직업/경력 관련 기억"
                    score={latestMemoryScore.topic_scores.career}
                  />
                  <ScoreItem
                    label="개인 취미/관심사"
                    score={latestMemoryScore.topic_scores.hobbies}
                  />
                  <ScoreItem
                    label="중요 생애 사건"
                    score={latestMemoryScore.topic_scores.life_events}
                  />
                </>
              )}
            </div>
            <div className="mt-6 p-4 bg-neutral-light rounded-lg">
              <p className="text-sm text-neutral-gray-medium">
                <strong>인사이트:</strong> 가족 관련 기억이 가장 강한 것으로 나타났습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 언어·인지 기능 변화 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-h2 font-semibold text-neutral-gray-dark mb-4">
            언어 능력 추이
          </h2>
          <Line data={lineData} options={lineOptions} />
        </div>
        <div className="card p-6">
          <h2 className="text-h2 font-semibold text-neutral-gray-dark mb-4">
            대화 흐름 분석
          </h2>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* 추천 상호작용 가이드 */}
      {interactionGuide && (
        <div className="card p-6 bg-gradient-to-r from-primary/10 to-secondary-medium/10 border-primary/30">
          <h2 className="text-h2 font-semibold text-neutral-gray-dark mb-4">
            오늘의 추천 상호작용 가이드
          </h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                  ✨
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-gray-dark mb-1">
                    추천 대화 주제: {interactionGuide.recommended_topic}
                  </h3>
                  <p className="text-sm text-neutral-gray-medium">
                    {interactionGuide.reason}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-neutral-gray-dark mb-2 flex items-center gap-2">
                  <span className="text-success">✓</span> 대화 팁
                </h4>
                <ul className="space-y-1">
                  {interactionGuide.conversation_tips.map((tip, index) => (
                    <li key={index} className="text-sm text-neutral-gray-medium flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-neutral-gray-dark mb-2 flex items-center gap-2">
                  <span className="text-error">✗</span> 피해야 할 주제
                </h4>
                <ul className="space-y-1">
                  {interactionGuide.topics_to_avoid.map((topic, index) => (
                    <li key={index} className="text-sm text-neutral-gray-medium flex items-start gap-2">
                      <span className="text-error mt-1">•</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button className="btn-primary w-full md:w-auto">
              시도했어요
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface ScoreItemProps {
  label: string;
  score: number;
}

function ScoreItem({ label, score }: ScoreItemProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-neutral-gray-medium">{label}</span>
        <span className="text-sm font-semibold text-neutral-gray-dark">{score}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${getScoreColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
