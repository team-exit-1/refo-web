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
import ReactMarkdown from 'react-markdown';
import { useUserAnalysis } from '../hooks/useApi';
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
  const { data: analysisData, isLoading: isAnalysisLoading, error: analysisError } = useUserAnalysis('user_2419');

  // 데이터가 없을 때 표시할 예시 Markdown
  const exampleMarkdown = `# 인지·언어 상태 분석 리포트

## 종합 평가

전반적인 인지 기능은 **양호한 상태**입니다.

- 평가 기준일: 2025년 11월 7일
- 전체 점수: 77.5점 (100점 만점)

---

## 주제별 기억력 분석

### 1. 가족 관련 기억 (85점)

가족에 대한 기억이 가장 잘 유지되고 있습니다. 특히 손주들에 대한 기억이 선명합니다.

**추천 활동**
- 가족 사진 앨범을 함께 보며 이야기 나누기
- 손주들과 정기적으로 영상 통화하기
- 가족 모임 때 옛날 이야기 들려주기

---

### 2. 직업/경력 관련 기억 (70점)

직장 생활에 대한 기억은 보통 수준입니다. 전반적인 내용은 기억하지만 세부적인 것은 조금씩 잊어가고 있습니다.

**추천 활동**
- 예전 직장 동료들과 만남 주선하기
- 직장에서의 성취나 보람 있었던 일 회상하기
- 과거 업무와 관련된 이야기 나누기

---

### 3. 취미/관심사 (75점)

개인적인 취미 활동에 대한 기억이 잘 유지되고 있습니다.

**추천 활동**
- 좋아하는 취미 활동 계속 이어가기
- 새로운 관심사 찾아보기
- 비슷한 취미를 가진 분들과 교류하기

---

### 4. 중요한 생애 사건 (80점)

인생의 중요한 순간들에 대한 기억이 좋은 편입니다.

**추천 활동**
- 기념일이나 특별한 날 함께 축하하기
- 과거 여행이나 특별한 경험 회상하기
- 인생의 중요한 순간들 사진으로 정리하기

---

`;

  // 도메인별 점수를 레이더 차트용으로 변환
  const getDomainScore = (domainName: string) => {
    const domain = analysisData?.domains.find(d => d.domain === domainName);
    return domain?.score || 0;
  };

  // 레이더 차트 데이터 (기억 유지 지수)
  const radarData = {
    labels: ['가족', '직업/경력', '취미/관심사', '생애 사건'],
    datasets: [
      {
        label: '기억 강도',
        data: analysisData?.domains 
          ? [
              getDomainScore('가족'),
              getDomainScore('직업/경력'),
              getDomainScore('취미/관심사'),
              getDomainScore('생애 사건'),
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
        {isAnalysisLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-neutral-gray-medium">AI가 분석 리포트를 생성하는 중...</p>
              <p className="text-sm text-neutral-gray-light mt-2">수십 초 정도 소요될 수 있습니다</p>
            </div>
          </div>
        ) : analysisError ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-h3 font-semibold text-neutral-gray-dark mb-2">
                분석 리포트 생성 실패
              </h3>
              <p className="text-neutral-gray-medium mb-4">
                LLM 서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
              </p>
            </div>
          </div>
        ) : (
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
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
              {analysisData?.report || exampleMarkdown}
            </ReactMarkdown>
          </div>
        )}
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
