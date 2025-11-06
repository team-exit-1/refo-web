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
import { Radar } from 'react-chartjs-2';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { useMemoryScores, useCognitiveMetrics, useAnalysisReport } from '../hooks/useApi';
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
  const { data: analysisReport, isLoading: isReportLoading } = useAnalysisReport(currentElder?.elder_id || '');

  // 데이터가 없을 때 표시할 예시 Markdown
  const exampleMarkdown = `# 인지·언어 상태 분석 리포트 (예시)

## 📊 종합 점수

현재 어르신의 전반적인 인지 기능을 분석한 결과입니다.

- **전체 기억 점수**: $\\overline{x} = 77.5$점
- **평가 기준일**: 2025년 11월 6일

---

## 🧠 주제별 기억 분석

### 1. 가족 관련 기억 (85점)
가족에 대한 기억이 가장 강하게 유지되고 있습니다. 특히 **손주**에 대한 기억이 선명합니다.

$$
\\text{Family Score} = \\frac{\\sum_{i=1}^{n} w_i \\cdot s_i}{n} = 85
$$

**권장 사항**:
- 가족 사진 앨범을 함께 보며 추억 이야기 나누기
- 손주들과의 정기적인 영상 통화 유지

### 2. 직업/경력 관련 기억 (70점)
직업 관련 기억은 중간 수준입니다. 일부 세부사항이 흐릿해지는 경향이 있습니다.

**권장 사항**:
- 과거 직장 동료들과의 만남 주선
- 직업 관련 성취에 대한 대화 유도

`;

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

  return (
    <div className="space-y-6">
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

      {/* Markdown 리포트 */}
      <div className="card p-8">
        {isReportLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-neutral-gray-medium">분석 리포트를 불러오는 중...</p>
            </div>
          </div>
        ) : (
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-neutral-gray-dark mb-4 pb-2 border-b-2 border-primary">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold text-neutral-gray-dark mt-8 mb-4">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-neutral-gray-dark mt-6 mb-3">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-body text-neutral-gray-medium leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 mb-4 text-neutral-gray-medium">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 mb-4 text-neutral-gray-medium">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="ml-4">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-primary">{children}</strong>
                ),
                code: ({ children }) => (
                  <code className="px-2 py-1 bg-neutral-light text-secondary-deep rounded text-sm font-mono">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-neutral-light p-4 rounded-lg overflow-x-auto mb-4">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic text-neutral-gray-medium my-4">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-6">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-primary/10">{children}</thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
                ),
                tr: ({ children }) => (
                  <tr className="hover:bg-gray-50">{children}</tr>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-gray-dark">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-3 text-sm text-neutral-gray-medium">
                    {children}
                  </td>
                ),
                hr: () => (
                  <hr className="my-8 border-t-2 border-gray-200" />
                ),
              }}
            >
              {analysisReport?.content || exampleMarkdown}
            </ReactMarkdown>
          </div>
        )}
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
