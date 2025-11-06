// User (보호자) 타입
export interface User {
  user_id: string;
  name: string;
  email: string;
  role: 'primary_caregiver' | 'family_member';
}

// Elder (어르신) 타입
export interface Elder {
  elder_id: string;
  name: string;
  date_of_birth: string;
  diagnosis_info?: string;
  assigned_caregivers: string[];
}

// 대화 분석 결과
export interface AnalysisResult {
  sentence_length: number;
  word_diversity: number;
  response_delay: number;
  emotion_tags: string[];
}

// 대화 기록
export interface ConversationLog {
  conversation_id: string;
  elder_id: string;
  timestamp: string;
  transcript: string;
  audio_url?: string;
  duration: number;
  analysis_result: AnalysisResult;
}

// 위치 기록
export interface LocationRecord {
  location_id: string;
  elder_id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy: number;
}

// 타임캡슐
export interface TimeCapsule {
  capsule_id: string;
  elder_id: string;
  created_date: string;
  title: string;
  content: string;
  conversation_id?: string;
  topic_category: string;
  emotion_tags: string[];
  is_favorite: boolean;
}

// 기억 점수
export interface TopicScores {
  family: number;
  career: number;
  hobbies: number;
  life_events: number;
}

export interface MemoryScore {
  score_id: string;
  elder_id: string;
  assessment_date: string;
  topic_scores: TopicScores;
  overall_score: number;
}

// 언어·인지 기능 분석 데이터
export interface CognitiveMetrics {
  date: string;
  sentence_length: number;
  word_diversity: number;
  speech_rate: number;
  response_delay: number;
  topic_transitions: number;
}

// 추천 대화 가이드
export interface InteractionGuide {
  recommended_topic: string;
  reason: string;
  conversation_tips: string[];
  topics_to_avoid: string[];
  strategies: string[];
}

// 분석 리포트
export interface AnalysisReport {
  content: string; // Markdown 형식의 분석 리포트
  generated_at: string;
}

// 루틴
export interface Routine {
  id: number;
  user_id: string;
  title: string;
  content: string;
  times: string; // HH:mm 형식
  day_of_week: string[]; // ['월', '화', '수', ...]
  created_at: string;
  updated_at: string;
}

export interface RoutineCreateRequest {
  title: string;
  content: string;
  times: string;
  day_of_week: string[];
}
