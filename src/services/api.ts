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
  UserAnalysisData,
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

const mockAnalysisReport: UserAnalysisData = {
  userid: 'user_2419',
  domains: [
    {
      domain: '가족',
      score: 85,
      insights: [
        '손주에 대한 기억이 매우 선명합니다',
        '가족 사진을 보며 이야기하는 것을 즐깁니다',
        '최근 3일간 가족 관련 대화가 증가했습니다',
      ],
      analysis: '가족에 대한 기억이 가장 강하게 유지되고 있습니다. 특히 손주에 대한 애정이 깊고, 관련 기억이 생생합니다.',
    },
    {
      domain: '직업/경력',
      score: 70,
      insights: [
        '과거 직장에 대한 자부심이 있습니다',
        '일부 세부 업무 내용은 흐릿합니다',
        '동료들과의 추억을 자주 회상합니다',
      ],
      analysis: '직업 관련 기억은 중간 수준입니다. 전반적인 경력은 기억하지만 구체적인 업무 내용은 일부 흐릿해지고 있습니다.',
    },
    {
      domain: '취미/관심사',
      score: 75,
      insights: [
        '정원 가꾸기를 매우 좋아합니다',
        '계절별 꽃 이름을 잘 기억합니다',
        '새로운 식물에 대한 호기심이 많습니다',
      ],
      analysis: '취미 활동에 대한 기억이 비교적 잘 유지되고 있습니다. 특히 정원 가꾸기에 대한 열정이 지속되고 있습니다.',
    },
    {
      domain: '생애 사건',
      score: 80,
      insights: [
        '결혼식과 자녀 출산을 생생히 기억합니다',
        '중요한 기념일을 잘 챙깁니다',
        '과거 여행 경험을 즐겁게 회상합니다',
      ],
      analysis: '중요한 생애 사건에 대한 기억이 양호합니다. 감정적으로 중요했던 순간들을 특히 잘 기억하고 있습니다.',
    },
  ],
  report: `
# 인지·언어 상태 분석 리포트

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

## 📝 종합 의견

김영희님은 전반적으로 **안정적인 인지 상태**를 유지하고 있습니다. 특히 가족 관련 기억이 강하므로, 이를 활용한 대화와 활동이 효과적일 것입니다.

### 다음 평가 예정
- **날짜**: 2025년 11월 13일
- **주기**: 매주 1회

> **참고**: 이 리포트는 AI 기반 자동 분석 결과이며, 전문의의 진단을 대체할 수 없습니다.
`,
  analyzedAt: new Date().toISOString(),
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

  // 사용자 분석 보고서 (통합 API)
  getUserAnalysis: async (userId: string): Promise<UserAnalysisData> => {
    try {
      const response = await axiosInstance.get(`/v1/users/${userId}/analysis`);
      return response.data.data;
    } catch (error) {
      console.error('사용자 분석 조회 실패:', error);
      // 에러 발생 시 Mock 데이터 반환 (개발용)
      return mockAnalysisReport;
    }
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
