import type {
  Elder,
  MemoryScore,
  CognitiveMetrics,
  InteractionGuide,
  LocationRecord,
  TimeCapsule,
} from '../types';

// API Base URL (환경변수로 관리)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

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
