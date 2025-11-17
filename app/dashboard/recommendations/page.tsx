'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  Calendar, 
  Award,
  Users,
  TrendingUp,
  Filter,
  Search,
  Clock,
  Sparkles,
  Target,
  CheckCircle
} from 'lucide-react';

const CareerBot = dynamic(() => import('@/components/CareerBot'), { ssr: false });

const categories = [
  { value: 'all', label: '전체' },
  { value: 'contest', label: '공모전' },
  { value: 'hackathon', label: '해커톤' },
  { value: 'project', label: '프로젝트' },
  { value: 'club', label: '동아리' },
  { value: 'internship', label: '인턴십' },
];

const fields = [
  { value: 'all', label: '전체 분야', color: '#6B6D70' },
  { value: 'IT', label: 'IT/개발', color: '#418CC3' },
  { value: '기획', label: '기획/전략', color: '#9C6BB3' },
  { value: '디자인', label: '디자인', color: '#D77B0F' },
  { value: '마케팅', label: '마케팅', color: '#25A778' },
  { value: '경영', label: '경영/사업', color: '#DC2626' },
];

const sortOptions = [
  { value: 'recommended', label: '추천순', Icon: Sparkles },
  { value: 'deadline', label: '마감임박순', Icon: Clock },
  { value: 'popular', label: '인기순', Icon: TrendingUp },
  { value: 'prize', label: '상금순', Icon: Award },
];

interface Activity {
  id: string;
  title: string;
  organization: string;
  category: string;
  type: string;
  description: string;
  fields: string[];
  tags: string[];
  application_end_date: string;
  prize_money?: number;
  url: string;
  image_url?: string;
  match_score: number;
  match_reasons: {
    major_match?: number;
    keyword_match?: number;
    interest_match?: number;
  };
  is_bookmarked: boolean;
  days_left: number;
}

export default function RecommendationsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedField, setSelectedField] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCareerBot, setShowCareerBot] = useState(false);

  // 활동 목록 조회
  const { data: activitiesData, isLoading } = useQuery({
    queryKey: ['recommendations', selectedCategory, selectedField, sortBy, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedField !== 'all') params.append('fields', selectedField);
      params.append('sort', sortBy);
      params.append('limit', '20');
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/recommendations/activities?${params}`, {
        headers: {
          'x-user-id': localStorage.getItem('x-user-id') || '',
        },
      });
      return response.json();
    },
  });

  // 북마크 토글
  const bookmarkMutation = useMutation({
    mutationFn: async ({ activityId, isBookmarked }: { activityId: string; isBookmarked: boolean }) => {
      const method = isBookmarked ? 'DELETE' : 'POST';
      const response = await fetch(`/api/recommendations/activities/${activityId}/bookmark`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': localStorage.getItem('x-user-id') || '',
        },
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      toast.success('북마크가 업데이트되었습니다');
    },
  });

  const activities: Activity[] = activitiesData?.data?.activities || [];

  const handleBookmarkToggle = (activityId: string, isBookmarked: boolean) => {
    bookmarkMutation.mutate({ activityId, isBookmarked });
  };

  const getDaysLeftColor = (daysLeft: number) => {
    if (daysLeft <= 3) return '#DC2626';
    if (daysLeft <= 7) return '#D77B0F';
    return '#6B6D70';
  };

  const formatPrizeMoney = (amount?: number) => {
    if (!amount) return null;
    if (amount >= 100000000) return `${(amount / 100000000).toFixed(0)}억원`;
    if (amount >= 10000) return `${(amount / 10000).toFixed(0)}만원`;
    return `${amount.toLocaleString()}원`;
  };

  const handleCareerBotComplete = (selectedTrack: string, selectedField: string, activityType: string) => {
    // 선택된 직무와 활동 유형으로 필터 설정
    if (activityType !== 'all') {
      setSelectedCategory(activityType);
    }
    setSelectedField(selectedField);
    setSortBy('recommended');
    
    // 사용자 프로필 저장 (TODO: API 연동)
    localStorage.setItem('userCareerTrack', selectedTrack);
    localStorage.setItem('userCareerField', selectedField);
    
    toast.success('진로 추천이 완료되었습니다! 맞춤 활동을 확인해보세요 🎉');
    setShowCareerBot(false);
    
    // 필터 적용 후 데이터 새로고침
    queryClient.invalidateQueries({ queryKey: ['recommendations'] });
  };

  return (
    <div className="min-h-screen bg-[#F1F2F3]">
      <div className="max-w-7xl mx-auto p-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1B1C1E] mb-2">
            활동 추천
          </h1>
          <p className="text-[#6B6D70]">
            당신의 학과와 관심사에 맞는 실제 공모전, 프로젝트, 동아리를 추천합니다
          </p>
        </div>

        {/* AI 추천 배너 */}
        <div className="card mb-6 bg-gradient-to-r from-[#DDF3EB] to-[#E8F1FF]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#25A778] rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1B1C1E] mb-1">
                AI가 분석한 맞춤 추천
              </h3>
              <p className="text-sm text-[#6B6D70]">
                당신의 회고 데이터와 관심사를 기반으로 <strong>{activities.length}개</strong>의 활동을 추천합니다
              </p>
            </div>
            <button
              onClick={() => setShowCareerBot(true)}
              className="btn-primary whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              경험 추천받기
            </button>
          </div>
        </div>

        {/* 필터 영역 */}
        <div className="card mb-6">
          {/* 검색 */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B6D70]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="활동명, 기관명, 키워드 검색..."
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* 카테고리 */}
          <div className="mb-4">
            <label className="text-sm font-medium text-[#1B1C1E] mb-2 block">
              활동 유형
            </label>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === cat.value
                      ? 'bg-[#25A778] text-white shadow-md'
                      : 'bg-white text-[#6B6D70] hover:bg-[#F1F2F3] border border-[#EAEBEC]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 분야 */}
          <div className="mb-4">
            <label className="text-sm font-medium text-[#1B1C1E] mb-2 block">
              관심 분야
            </label>
            <div className="flex gap-2 flex-wrap">
              {fields.map((field) => (
                <button
                  key={field.value}
                  onClick={() => setSelectedField(field.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedField === field.value
                      ? 'shadow-md'
                      : 'bg-white border border-[#EAEBEC] hover:bg-[#F1F2F3]'
                  }`}
                  style={{
                    backgroundColor: selectedField === field.value ? field.color : undefined,
                    color: selectedField === field.value ? 'white' : '#6B6D70',
                  }}
                >
                  {field.label}
                </button>
              ))}
            </div>
          </div>

          {/* 정렬 */}
          <div>
            <label className="text-sm font-medium text-[#1B1C1E] mb-2 block">
              정렬 기준
            </label>
            <div className="flex gap-2">
              {sortOptions.map((option) => {
                const Icon = option.Icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      sortBy === option.value
                        ? 'bg-[#418CC3] text-white shadow-md'
                        : 'bg-white text-[#6B6D70] hover:bg-[#F1F2F3] border border-[#EAEBEC]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 로딩 */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#25A778]"></div>
            <p className="mt-4 text-[#6B6D70]">활동을 불러오는 중...</p>
          </div>
        )}

        {/* 활동 그리드 */}
        {!isLoading && activities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="card hover:shadow-lg transition-all cursor-pointer group relative"
              >
                {/* 매칭 점수 배지 */}
                {activity.match_score > 0.7 && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="px-3 py-1 bg-[#25A778] text-white rounded-full text-xs font-bold flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {Math.round(activity.match_score * 100)}% 매칭
                    </div>
                  </div>
                )}

                {/* 이미지 */}
                {activity.image_url ? (
                  <div className="w-full h-40 bg-[#F1F2F3] rounded-lg mb-4 overflow-hidden">
                    <img
                      src={activity.image_url}
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-[#DDF3EB] to-[#E8F1FF] rounded-lg mb-4 flex items-center justify-center">
                    <Award className="w-16 h-16 text-[#25A778] opacity-20" />
                  </div>
                )}

                {/* 카테고리 & 북마크 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-[#DDF3EB] text-[#186D50] rounded-md text-xs font-bold">
                      {activity.type}
                    </span>
                    {activity.days_left <= 7 && (
                      <span
                        className="px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1"
                        style={{
                          backgroundColor: `${getDaysLeftColor(activity.days_left)}20`,
                          color: getDaysLeftColor(activity.days_left),
                        }}
                      >
                        <Clock className="w-3 h-3" />
                        D-{activity.days_left}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmarkToggle(activity.id, activity.is_bookmarked);
                    }}
                    className="p-2 hover:bg-[#F1F2F3] rounded-lg transition-colors"
                  >
                    {activity.is_bookmarked ? (
                      <BookmarkCheck className="w-5 h-5 text-[#25A778]" />
                    ) : (
                      <Bookmark className="w-5 h-5 text-[#6B6D70]" />
                    )}
                  </button>
                </div>

                {/* 제목 */}
                <h3 className="font-bold text-lg text-[#1B1C1E] mb-2 line-clamp-2 min-h-[56px]">
                  {activity.title}
                </h3>

                {/* 기관명 */}
                <div className="flex items-center gap-2 text-sm text-[#6B6D70] mb-3">
                  <Users className="w-4 h-4" />
                  {activity.organization}
                </div>

                {/* 설명 */}
                <p className="text-sm text-[#6B6D70] line-clamp-2 mb-4">
                  {activity.description}
                </p>

                {/* 분야 태그 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {activity.fields.slice(0, 3).map((field, idx) => {
                    const fieldColor = fields.find((f) => f.value === field)?.color || '#6B6D70';
                    return (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-md text-xs font-medium"
                        style={{
                          backgroundColor: `${fieldColor}20`,
                          color: fieldColor,
                        }}
                      >
                        {field}
                      </span>
                    );
                  })}
                </div>

                {/* 하단 정보 */}
                <div className="pt-4 border-t border-[#EAEBEC] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-[#6B6D70]">
                    <Calendar className="w-4 h-4" />
                    ~{new Date(activity.application_end_date).toLocaleDateString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  {activity.prize_money && (
                    <div className="flex items-center gap-1 text-sm font-bold text-[#25A778]">
                      <Award className="w-4 h-4" />
                      {formatPrizeMoney(activity.prize_money)}
                    </div>
                  )}
                </div>

                {/* 매칭 이유 (호버 시 표시) */}
                {activity.match_score > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#EAEBEC]">
                    <div className="text-xs font-medium text-[#6B6D70] mb-2">
                      추천 이유
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activity.match_reasons.major_match && (
                        <div className="flex items-center gap-1 text-xs px-2 py-1 bg-[#E8F1FF] text-[#418CC3] rounded-md">
                          <CheckCircle className="w-3 h-3" />
                          학과 매칭
                        </div>
                      )}
                      {activity.match_reasons.keyword_match && (
                        <div className="flex items-center gap-1 text-xs px-2 py-1 bg-[#DDF3EB] text-[#186D50] rounded-md">
                          <CheckCircle className="w-3 h-3" />
                          키워드 일치
                        </div>
                      )}
                      {activity.match_reasons.interest_match && (
                        <div className="flex items-center gap-1 text-xs px-2 py-1 bg-[#F0E8FF] text-[#9C6BB3] rounded-md">
                          <CheckCircle className="w-3 h-3" />
                          관심사 부합
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 외부 링크 버튼 */}
                <a
                  href={activity.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 btn-primary w-full flex items-center justify-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  자세히 보기
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}

        {/* 빈 상태 */}
        {!isLoading && activities.length === 0 && (
          <div className="card text-center py-12">
            <Award className="w-16 h-16 text-[#CACBCC] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#1B1C1E] mb-2">
              추천 활동이 없습니다
            </h3>
            <p className="text-[#6B6D70] mb-4">
              필터를 변경하거나 관심사를 설정해보세요
            </p>
            <button
              onClick={() => router.push('/dashboard/settings')}
              className="btn-primary"
            >
              관심사 설정하기
            </button>
          </div>
        )}
      </div>

      {/* 진로봇 모달 */}
      {showCareerBot && (
        <CareerBot
          onClose={() => setShowCareerBot(false)}
          onComplete={handleCareerBotComplete}
        />
      )}
    </div>
  );
}
