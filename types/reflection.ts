// 회고 시스템 타입 정의
// 모든 회고 관련 인터페이스와 타입을 중앙에서 관리

export interface ReflectionTemplate {
  id: string;
  name: string;
  description: string;
  category: '기본' | '심화' | '감정' | '분석' | '정기';
  questions: string[];
  usage_count: number;
  is_ai_recommended: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReflectionSpace {
  id: string;
  user_id: string;
  name: string;
  type: '공모전' | '프로젝트' | '동아리' | '스터디';
  description?: string;
  start_date: string;
  end_date: string;
  reflection_cycle: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  reminder_enabled: boolean;
  next_reflection_date: string;
  total_reflections: number;
  status: 'active' | 'paused' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface ReflectionAnswer {
  question: string;
  answer: string;
}

export interface Reflection {
  id: string;
  space_id: string;
  user_id: string;
  template_id: string;
  answers: ReflectionAnswer[];
  mood: 'great' | 'good' | 'normal' | 'bad' | 'terrible';
  progress_score: number; // 1-10
  ai_feedback?: string;
  ai_keywords?: string[];
  ai_sentiment_score?: number; // 0.00-1.00
  reflection_date: string;
  created_at: string;
  updated_at: string;
}

export interface ReflectionWithDetails extends Reflection {
  space: {
    id: string;
    name: string;
    type: string;
  };
  template_name: string;
}

export interface GrowthMetrics {
  avg_progress: number;
  completion_rate: number;
  keyword_count: number;
  project_completion: number;
}

export interface AIAnalysisStrength {
  title: string;
  description: string;
}

export interface AIAnalysisImprovement {
  title: string;
  description: string;
}

export interface AIAnalysisNextStep {
  title: string;
  action: string;
  expected_result: string;
}

export interface MonthlyProgressData {
  month: string;
  score: number;
}

export interface SkillDistributionData {
  skill: string;
  level: number;
}

export interface MoodDistributionData {
  mood: 'great' | 'good' | 'normal' | 'bad' | 'terrible';
  count: number;
}

export interface KeywordLevelData {
  keyword: string;
  level: number;
}

export interface AIGrowthAnalysis {
  summary: string;
  metrics: GrowthMetrics;
  strengths: AIAnalysisStrength[];
  improvements: AIAnalysisImprovement[];
  next_steps: AIAnalysisNextStep[];
  charts: {
    monthly_progress: MonthlyProgressData[];
    skill_distribution: SkillDistributionData[];
    mood_distribution: MoodDistributionData[];
    keyword_levels: KeywordLevelData[];
  };
  generated_at: string;
  expires_at: string;
}

// API 요청 타입
export interface CreateSpaceRequest {
  name: string;
  type: '공모전' | '프로젝트' | '동아리' | '스터디';
  description?: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  reflection_cycle: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  reminder_enabled: boolean;
}

export interface CreateReflectionRequest {
  space_id: string;
  template_id: string;
  answers: ReflectionAnswer[];
  mood: 'great' | 'good' | 'normal' | 'bad' | 'terrible';
  progress_score: number;
  reflection_date: string; // YYYY-MM-DD
}

export interface UpdateReflectionRequest {
  answers?: ReflectionAnswer[];
  mood?: 'great' | 'good' | 'normal' | 'bad' | 'terrible';
  progress_score?: number;
}

export interface RecommendTemplateRequest {
  user_id: string;
  recent_moods: string[];
  space_type: string;
}

export interface RecommendCycleRequest {
  type: '공모전' | '프로젝트' | '동아리' | '스터디';
  start_date: string;
  end_date: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface CreateSpaceResponse {
  id: string;
  name: string;
  type: string;
  description?: string;
  start_date: string;
  end_date: string;
  reflection_cycle: string;
  reminder_enabled: boolean;
  next_reflection_date: string;
  expected_reflections: number;
  created_at: string;
}

export interface TemplateRecommendation {
  template_id: string;
  reason: string;
}

export interface CycleRecommendation {
  recommended_cycle: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  reason: string;
  expected_reflections: number;
}

export interface UpcomingReflection {
  space_id: string;
  space_name: string;
  due_date: string;
  is_overdue: boolean;
  days_until: number;
}

export interface ReflectionSearchResult {
  id: string;
  space_name: string;
  template_name: string;
  mood: string;
  reflection_date: string;
  preview: string;
}

export interface KeywordTrend {
  keyword: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  change_percentage: number;
}

export interface SpaceStats {
  space_id: string;
  total_reflections: number;
  completion_rate: number;
  avg_progress_score: number;
  most_used_template: string;
  mood_trend: 'improving' | 'declining' | 'stable';
  top_keywords: string[];
}

// 컴포넌트 Props 타입
export interface TemplateCardProps {
  template: ReflectionTemplate;
  onSelect: (template: ReflectionTemplate) => void;
  isSelected?: boolean;
}

export interface SpaceCardProps {
  space: ReflectionSpace;
  onClick?: () => void;
}

export interface ReflectionCardProps {
  reflection: ReflectionWithDetails;
  onClick?: () => void;
}

export interface MoodSelectorProps {
  value: string;
  onChange: (mood: string) => void;
}

export interface ProgressSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export interface QuestionDropdownProps {
  questions: string[];
  selectedQuestion: string;
  onSelect: (question: string) => void;
  completedQuestions: string[];
}

// 유틸리티 타입
export type ReflectionCycle = 'daily' | 'weekly' | 'biweekly' | 'monthly';
export type SpaceType = '공모전' | '프로젝트' | '동아리' | '스터디';
export type MoodType = 'great' | 'good' | 'normal' | 'bad' | 'terrible';
export type SpaceStatus = 'active' | 'paused' | 'completed';
export type TemplateCategory = '기본' | '심화' | '감정' | '분석' | '정기';
export type AnalysisPeriod = 'last_30_days' | 'last_3_months' | 'last_6_months';
export type TrendDirection = 'up' | 'down' | 'stable';
export type MoodTrend = 'improving' | 'declining' | 'stable';

// 상수 타입
export const MOOD_OPTIONS = {
  great: { label: '매우 좋음', emoji: '😄', color: '#25A778' },
  good: { label: '좋음', emoji: '🙂', color: '#2DC98E' },
  normal: { label: '보통', emoji: '😐', color: '#6B6D70' },
  bad: { label: '안좋음', emoji: '😞', color: '#D77B0F' },
  terrible: { label: '매우 안좋음', emoji: '😢', color: '#DC2626' },
} as const;

export const SPACE_TYPES = {
  contest: { value: '공모전', label: '공모전', icon: '🏆' },
  project: { value: '프로젝트', label: '프로젝트', icon: '💼' },
  club: { value: '동아리', label: '동아리', icon: '👥' },
  study: { value: '스터디', label: '스터디', icon: '📚' },
} as const;

export const REFLECTION_CYCLES = {
  daily: { value: 'daily', label: '매일', description: '매일 꾸준히 기록' },
  weekly: { value: 'weekly', label: '주간', description: '일주일에 한 번' },
  biweekly: { value: 'biweekly', label: '격주', description: '2주에 한 번' },
  monthly: { value: 'monthly', label: '월간', description: '한 달에 한 번' },
} as const;

export const TEMPLATE_CATEGORIES = {
  basic: { value: '기본', label: '기본', description: '누구나 쉽게 시작' },
  advanced: { value: '심화', label: '심화', description: '깊이 있는 성찰' },
  emotional: { value: '감정', label: '감정', description: '감정 중심 회고' },
  analytical: { value: '분석', label: '분석', description: '문제 분석 및 해결' },
  regular: { value: '정기', label: '정기', description: '정기적인 점검' },
} as const;

// Form 타입
export interface SpaceFormData {
  name: string;
  type: SpaceType;
  description: string;
  start_date: string;
  end_date: string;
  reflection_cycle: ReflectionCycle;
  reminder_enabled: boolean;
}

export interface ReflectionFormData {
  content: string;
  answers: ReflectionAnswer[];
  mood: MoodType;
  progress_score: number;
}

// 에러 타입
export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  REFLECTION_ALREADY_SUBMITTED = 'REFLECTION_ALREADY_SUBMITTED',
  SPACE_NOT_ACTIVE = 'SPACE_NOT_ACTIVE',
  TEMPLATE_NOT_FOUND = 'TEMPLATE_NOT_FOUND',
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}
