import axiosInstance from './axiosInstance';
import type {
  Elder,
  MemoryScore,
  CognitiveMetrics,
  InteractionGuide,
  LocationRecord,
  TimeCapsule,
  Routine,
  RoutineCreateRequest,
  AnalysisReport,
} from '../types';

// Mock 데이터 (개발용)
const mockElder: Elder = {
  elder_id: '1',
  name: '김영희',
  date_of_birth: '1945-03-15',
  diagnosis_info: '경도 치매',
  assigned_caregivers: ['caregiver1'],
};

const mockMemoryScore: MemoryScore = {
  score_id: '1',
  elder_id: '1',
  assessment_date: new Date().toISOString(),
  topic_scores: {
    family: 85,
    career: 70,
    hobbies: 75,
    life_events: 80,
  },
  overall_score: 77.5,
};

const mockCognitiveMetrics: CognitiveMetrics[] = [
  {
    date: '2025-11-01',
    sentence_length: 12,
    word_diversity: 85,
    speech_rate: 120,
    response_delay: 2.5,
    topic_transitions: 5,
  },
  {
    date: '2025-11-02',
    sentence_length: 11,
    word_diversity: 82,
    speech_rate: 115,
    response_delay: 2.8,
    topic_transitions: 6,
  },
  {
    date: '2025-11-03',
    sentence_length: 13,
    word_diversity: 88,
    speech_rate: 125,
    response_delay: 2.3,
    topic_transitions: 4,
  },
];

const mockInteractionGuide: InteractionGuide = {
  recommended_topic: '손주 이야기',
  reason: '최근 3일간 가족 관련 기억 점수 상승 추세',
  conversation_tips: [
    '손주의 이름을 언급하며 시작해보세요',
    '구체적인 최근 일화를 공유해보세요',
    '긍정적인 감정을 표현하도록 유도하세요',
  ],
  topics_to_avoid: ['복잡한 금융 이야기', '정치 논쟁'],
  strategies: [
    '편안한 분위기에서 대화하기',
    '눈을 맞추며 천천히 말하기',
    '긍정적인 반응 보여주기',
  ],
};

const mockLocation: LocationRecord = {
  location_id: '1',
  elder_id: '1',
  latitude: 37.5665,
  longitude: 126.978,
  timestamp: new Date().toISOString(),
  accuracy: 10,
};

const mockTimeCapsules: TimeCapsule[] = [
  {
    capsule_id: '1',
    elder_id: '1',
    created_date: '2025-11-05',
    title: '손주와의 즐거운 시간',
    content: '오늘 손주가 방문해서 함께 옛날 사진을 보았습니다. 정말 행복한 시간이었어요.',
    topic_category: '가족',
    emotion_tags: ['행복', '그리움'],
    is_favorite: true,
  },
  {
    capsule_id: '2',
    elder_id: '1',
    created_date: '2025-11-03',
    title: '정원 가꾸기',
    content: '오늘은 날씨가 좋아서 정원에 꽃을 심었습니다. 봄이 기대됩니다.',
    topic_category: '취미',
    emotion_tags: ['평온', '기대'],
    is_favorite: false,
  },
];

const mockRoutines: Routine[] = [
  {
    id: 1,
    user_id: 'user_2419',
    title: '아침 산책',
    content: '공원에서 가벼운 산책 30분',
    times: '07:00',
    day_of_week: ['월', '수', '금'],
    created_at: '2024-11-01T00:00:00',
    updated_at: '2024-11-01T00:00:00',
  },
  {
    id: 2,
    user_id: 'user_2419',
    title: '약 복용',
    content: '혈압약, 당뇨약 복용',
    times: '09:00',
    day_of_week: ['월', '화', '수', '목', '금', '토', '일'],
    created_at: '2024-11-01T00:00:00',
    updated_at: '2024-11-01T00:00:00',
  },
  {
    id: 3,
    user_id: 'user_2419',
    title: '손주 전화',
    content: '손주들에게 안부 전화하기',
    times: '14:00',
    day_of_week: ['토', '일'],
    created_at: '2024-11-02T00:00:00',
    updated_at: '2024-11-02T00:00:00',
  },
];

const mockAnalysisReport: AnalysisReport = {
  content: `# 인지·언어 상태 분석 리포트

## 📊 종합 점수

현재 **김영희**님의 전반적인 인지 기능은 **양호**한 상태입니다.

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

### 3. 취미/관심사 (75점)
개인 취미 활동에 대한 기억이 비교적 잘 유지되고 있습니다.

**권장 사항**:
- 정원 가꾸기 등 취미 활동 지속적 지원
- 새로운 관심사 탐색 기회 제공

### 4. 생애 사건 (80점)
중요한 생애 사건에 대한 기억이 양호합니다.

---

## 📈 인지 기능 변화 추이

최근 3일간의 언어 분석 결과:

| 날짜 | 문장 길이 | 어휘 다양성 | 말하기 속도 | 응답 지연 |
|------|----------|------------|------------|----------|
| 11/01 | 12단어 | 85% | 120 WPM | 2.5초 |
| 11/02 | 11단어 | 82% | 115 WPM | 2.8초 |
| 11/03 | 13단어 | 88% | 125 WPM | 2.3초 |

### 통계적 분석

평균 문장 길이: 

$$
\\mu = \\frac{12 + 11 + 13}{3} = 12 \\text{ 단어}
$$

표준편차:

$$
\\sigma = \\sqrt{\\frac{\\sum(x_i - \\mu)^2}{n}} \\approx 1.0
$$

**해석**: 문장 길이가 안정적으로 유지되고 있어 언어 능력이 잘 보존되고 있습니다.

---

## 🎯 맞춤형 대화 가이드

### 추천 주제
- **손주 이야기**: 최근 3일간 가족 관련 기억 점수가 상승 추세입니다.

### 대화 팁
1. 손주의 이름을 언급하며 시작해보세요
2. 구체적인 최근 일화를 공유해보세요  
3. 긍정적인 감정을 표현하도록 유도하세요

### 피해야 할 주제
- ❌ 복잡한 금융 이야기
- ❌ 정치 논쟁

### 효과적인 전략
\`\`\`
✓ 편안한 분위기에서 대화하기
✓ 눈을 맞추며 천천히 말하기
✓ 긍정적인 반응 보여주기
\`\`\`

---

## 📝 종합 의견

김영희님은 전반적으로 **안정적인 인지 상태**를 유지하고 있습니다. 특히 가족 관련 기억이 강하므로, 이를 활용한 대화와 활동이 효과적일 것입니다.

### 다음 평가 예정
- **날짜**: 2025년 11월 13일
- **주기**: 매주 1회

> **참고**: 이 리포트는 AI 기반 자동 분석 결과이며, 전문의의 진단을 대체할 수 없습니다.
`,
  generated_at: new Date().toISOString(),
};

// Elder API
export const elderApi = {
  getElders: async (): Promise<Elder[]> => {
    // TODO: 실제 API 호출로 교체
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [mockElder];
  },
  
  getElder: async (elderId: string): Promise<Elder> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockElder;
  },
};

// Memory API
export const memoryApi = {
  getMemoryScores: async (elderId: string): Promise<MemoryScore[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [mockMemoryScore];
  },
  
  getCognitiveMetrics: async (elderId: string): Promise<CognitiveMetrics[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockCognitiveMetrics;
  },
  
  getInteractionGuide: async (elderId: string): Promise<InteractionGuide> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockInteractionGuide;
  },

  getAnalysisReport: async (elderId: string): Promise<AnalysisReport> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockAnalysisReport;
  },
};

// Location API
export const locationApi = {
  getCurrentLocation: async (elderId: string): Promise<LocationRecord> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockLocation;
  },
  
  getLocationHistory: async (
    elderId: string,
    startDate?: string,
    endDate?: string
  ): Promise<LocationRecord[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [mockLocation];
  },
};

// TimeCapsule API
export const timeCapsuleApi = {
  getTimeCapsules: async (elderId: string): Promise<TimeCapsule[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockTimeCapsules;
  },
  
  getTimeCapsule: async (capsuleId: string): Promise<TimeCapsule> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockTimeCapsules[0];
  },
  
  createTimeCapsule: async (capsule: Omit<TimeCapsule, 'capsule_id'>): Promise<TimeCapsule> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      ...capsule,
      capsule_id: Date.now().toString(),
    };
  },
  
  updateTimeCapsule: async (capsule: TimeCapsule): Promise<TimeCapsule> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return capsule;
  },
  
  deleteTimeCapsule: async (capsuleId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
};

// Routine API
export const routineApi = {
  getRoutines: async (): Promise<{ items: Routine[]; total: number }> => {
    try {
      const response = await axiosInstance.get('/v1/routines');
      // API 응답 구조: { status, code, message, data }
      return response.data.data;
    } catch (error) {
      console.error('루틴 목록 조회 실패:', error);
      // 에러 발생 시 Mock 데이터 반환 (개발용)
      return {
        items: mockRoutines,
        total: mockRoutines.length,
      };
    }
  },

  createRoutine: async (routine: RoutineCreateRequest): Promise<Routine> => {
    try {
      const response = await axiosInstance.post('/v1/routines', routine);
      return response.data.data;
    } catch (error) {
      console.error('루틴 생성 실패:', error);
      // 에러 발생 시 Mock 데이터 반환 (개발용)
      return {
        id: Date.now(),
        user_id: 'user_2419',
        ...routine,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  },

  deleteRoutine: async (routineId: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/v1/routines/${routineId}`);
    } catch (error) {
      console.error('루틴 삭제 실패:', error);
      // 에러 발생 시 무시 (개발용)
    }
  },
};
