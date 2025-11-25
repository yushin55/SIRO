'use client';

import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Plus, Sparkles, TrendingUp, Calendar, BookOpen, Heart, Target } from 'lucide-react';
import toast from 'react-hot-toast';

// 활동 타입별 아이콘 및 라벨 매핑
const getActivityInfo = (activityType: string) => {
  const map: Record<string, { icon: string; label: string }> = {
    contest: { icon: '', label: '공모전' },
    club: { icon: '', label: '동아리' },
    project: { icon: '', label: '프로젝트' },
    internship: { icon: '', label: '인턴' },
    study: { icon: '', label: '스터디' },
    etc: { icon: '', label: '기타' },
  };
  return map[activityType] || { icon: '', label: '활동' };
};

export default function ReflectionsPage() {
  const router = useRouter();
  

  // 최근 마이크로 로그
  const { data: recentLogs } = useQuery({
    queryKey: ['micro-logs-recent'],
    queryFn: async () => {
      const response = await fetch('/api/v1/reflections/micro?limit=7', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-user-id': localStorage.getItem('x-user-id') || 'dev-user-default',
        },
      });
      return response.json();
    },
  });

  // STAR 회고 데이터도 조회
  const { data: starReflections } = useQuery({
    queryKey: ['star-reflections-recent'],
    queryFn: async () => {
      const response = await fetch('/api/v1/reflections?limit=7', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-user-id': localStorage.getItem('x-user-id') || 'dev-user-default',
        },
      });
      return response.json();
    },
  });

  // 이번주 통계
  const { data: weekStats } = useQuery({
    queryKey: ['week-stats'],
    queryFn: async () => {
      const response = await fetch('/api/v1/reflections/stats?period=week', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-user-id': localStorage.getItem('x-user-id') || 'dev-user-default',
        },
      });
      return response.json();
    },
  });

  // 전체 로그(요약용) - 마이크로 로그 + AI 회고 (limit 높게) -> 통계 계산
  const { data: allMicro } = useQuery({
    queryKey: ['micro-logs-all-summary'],
    queryFn: async () => {
      const resp = await fetch('/api/v1/reflections/micro?limit=200', {
        headers: { 'x-user-id': localStorage.getItem('x-user-id') || 'dev-user-default' },
      });
      return resp.json();
    },
  });

  const { data: allStars } = useQuery({
    queryKey: ['star-reflections-all-summary'],
    queryFn: async () => {
      const resp = await fetch('/api/v1/reflections?limit=200', {
        headers: { 'x-user-id': localStorage.getItem('x-user-id') || 'dev-user-default' },
      });
      return resp.json();
    },
  });

  // 내 스페이스 목록 (진행중 스페이스 삭제 기능 제공)
  const { data: mySpaces } = useQuery({
    queryKey: ['my-spaces'],
    queryFn: async () => {
      const resp = await fetch('/api/v1/spaces', {
        headers: { 'x-user-id': localStorage.getItem('x-user-id') || 'dev-user-default' },
      });
      return resp.json();
    },
  });
  const queryClient = useQueryClient();

  // 사용자 오늘의 컨디션 (0-100)
  const [health, setHealth] = useState<string>('50');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('today_health');
      if (saved) setHealth(saved);
    }
  }, []);
  
  // 마이크로 로그와 STAR 회고 합치기
  const microLogs = recentLogs?.data?.logs || [];
  const starReflectionsList = starReflections?.data?.reflections || [];
  const starLogs = starReflectionsList.map((reflection: any) => {
    // answers 객체에서 실제 답변 추출
    let memoText = '';
    if (reflection.answers && typeof reflection.answers === 'object') {
      const answerValues = Object.values(reflection.answers);
      if (answerValues.length > 0) {
        // 첫 번째 답변을 주로 표시 (STAR의 Situation 등)
        memoText = String(answerValues[0]).substring(0, 150);
      }
    }
    
    // answers가 없으면 ai_feedback이나 content 사용
    if (!memoText && reflection.ai_feedback) {
      memoText = String(reflection.ai_feedback).substring(0, 150);
    } else if (!memoText && reflection.content) {
      memoText = String(reflection.content).substring(0, 150);
    }
    
    return {
      id: reflection.id,
      activity_type: 'reflection',
      activity_label: reflection.template_name || 'AI 회고',
      activity_icon: '',
      memo: memoText,
      date: reflection.created_at,
      tags: reflection.competencies || [],
      isStarReflection: true,
    };
  });
  
  // 날짜순으로 정렬하여 합치기
  let combinedLogs = [...microLogs, ...starLogs]
    .sort((a, b) => new Date(b.date || b.created_at).getTime() - new Date(a.date || a.created_at).getTime());

  // STAR 회고 중 내용이 없는(빈) 항목은 표시하지 않음
  combinedLogs = combinedLogs.filter((l) => {
    if (l.isStarReflection) {
      return !!(l.memo && String(l.memo).trim());
    }
    return true;
  });

  const logs = combinedLogs.slice(0, 7);
  
  // 통계에 STAR 회고 포함
  const baseStats = weekStats?.data || {};
  const stats = {
    ...baseStats,
    total_logs: (baseStats.total_logs || 0) + starReflectionsList.length,
  };

  // 추가 통계 계산 (클라이언트 측 요약)
  const allMicroLogs = allMicro?.data?.logs || [];
  const allStarLogs = allStars?.data?.reflections || [];
  const allCombined = [...allMicroLogs, ...allStarLogs].sort((a: any, b: any) => new Date(b.created_at || b.date).getTime() - new Date(a.created_at || a.date).getTime());

  const totalReflections = allCombined.length;
  const thisWeekCount = allCombined.filter((l: any) => {
    const d = new Date(l.created_at || l.date);
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    return d >= weekAgo;
  }).length;

  // 연속 작성(최근 날짜들에서 streak 계산)
  const computeStreak = () => {
    if (!allCombined.length) return 0;
    const dates = Array.from(new Set(allCombined.map((l: any) => (new Date(l.created_at || l.date)).toISOString().slice(0,10)))).sort().reverse();
    let streak = 0;
    let cursor = new Date().toISOString().slice(0,10);
    for (let i = 0; i < dates.length; i++) {
      if (dates[i] <= cursor) {
        if (dates[i] === cursor) {
          streak += 1;
          const prev = new Date(cursor); prev.setDate(prev.getDate() - 1); cursor = prev.toISOString().slice(0,10);
        } else {
          break;
        }
      }
    }
    return streak;
  };
  const consecutiveDays = computeStreak();

  const activityTypesCount = allCombined.reduce((acc: any, cur: any) => {
    const key = cur.activity_type || (cur.template_name ? 'AI 회고' : 'other');
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const spacesCount = new Set(allCombined.map((l: any) => l.space_id).filter(Boolean)).size;

  // 성장 키워드(top N)
  const keywordCounts: Record<string, number> = {};
  allCombined.forEach((l: any) => {
    const tags = l.tags || l.competencies || [];
    tags.forEach((t: string) => { keywordCounts[t] = (keywordCounts[t] || 0) + 1; });
  });
  const growthKeywords = Object.entries(keywordCounts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(e=>({k:e[0], c:e[1]}));

  return (
    <div className="min-h-screen bg-[#F1F2F3]">
      <div className="max-w-6xl mx-auto p-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1B1C1E] mb-2">경험정리</h1>
              <p className="text-[#6B6D70]">경험을 기록하고, 성장 패턴을 발견하세요</p>
            </div>
            <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/dashboard/reflections/survey')}
                  className="btn-primary flex items-center gap-2 bg-gradient-to-r from-[#25A778] to-[#2DC98E]"
                >
                  <span>경험 정리 시작</span>
                </button>
                {/* 팀 공유 기능은 스페이스 생성에서 관리합니다 */}
            </div>
          </div>

          {/* 오늘의 컨디션 (0-100) */}
          <div className="bg-gradient-to-r from-[#FFF7ED] to-[#FFFBF0] rounded-xl p-6 border-2 border-[#FFDAB9]/40 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-[#6B2A00] mb-2">오늘의 컨디션</h3>
                <p className="text-sm text-[#6B2A00] mb-3">오늘의 기분 혹은 팀의 상태를 0(매우 나쁨) ~ 100(매우 좋음)으로 체크해주세요.</p>
                <div className="flex items-center gap-3">
                  <input
                    id="healthRange"
                    type="range"
                    min={0}
                    max={100}
                    value={Number(health)}
                    className="w-64"
                    onChange={(e) => {
                      const v = e.currentTarget.value;
                      setHealth(v);
                      localStorage.setItem('today_health', v);
                    }}
                  />
                  <span className="text-2xl font-bold text-[#6B2A00] w-16 text-center">{health}</span>
                  <button
                    onClick={async () => {
                      try {
                        const currentSpaceId = localStorage.getItem('current-space-id');
                        await fetch('/api/v1/health-check', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                            'x-user-id': localStorage.getItem('x-user-id') || 'dev-user-default',
                          },
                          body: JSON.stringify({
                            health_score: parseInt(health),
                            space_id: currentSpaceId || null,
                            date: new Date().toISOString().split('T')[0]
                          })
                        });
                        toast.success('컨디션이 저장되었습니다!');
                      } catch (error) {
                        console.error('Failed to save health check:', error);
                        toast.error('저장에 실패했습니다');
                      }
                    }}
                    className="btn-primary px-4 py-2"
                  >
                    저장하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* 이번 주 통계 */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#25A778]" />
                <h3 className="font-bold text-[#1B1C1E]">이번 주</h3>
              </div>
              <button
                onClick={() => router.push('/dashboard/reflections/history?filter=week')}
                className="text-xs text-[#25A778] hover:text-[#186D50]"
              >
                더보기
              </button>
            </div>
            <div className="text-3xl font-bold text-[#25A778] mb-1">
              {stats?.total_logs || 0}개
            </div>
            <p className="text-sm text-[#6B6D70]">활동 기록</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#DC2626]" />
                <h3 className="font-bold text-[#1B1C1E]">좋았던 경험</h3>
              </div>
              <button
                onClick={() => router.push('/dashboard/reflections/history?filter=favorites')}
                className="text-xs text-[#DC2626] hover:text-[#B91C1C]"
              >
                더보기
              </button>
            </div>
            <div className="text-3xl font-bold text-[#DC2626] mb-1">
              {stats?.positive_logs || 0}개
            </div>
            <p className="text-sm text-[#6B6D70]">내가 좋아요한 기록</p>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-[#418CC3]" />
              <h3 className="font-bold text-[#1B1C1E]">성장 추세</h3>
            </div>
            <div className="text-3xl font-bold text-[#418CC3] mb-1">
              {stats?.growth_trend || '→'}
            </div>
            <p className="text-sm text-[#6B6D70]">지난주 대비</p>
          </div>
        </div>

        {/* 빠른 액션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => router.push('/dashboard/reflections/survey')}
            className="card hover:shadow-lg transition-all cursor-pointer text-left bg-gradient-to-br from-[#25A778] to-[#2DC98E] text-white"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-1">경험 정리 시작</h3>
                <p className="text-sm text-white/90">
                  설문으로 맞춤 템플릿 추천받고 회고하기
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/dashboard/reflections/micro')}
            className="card hover:shadow-lg transition-all cursor-pointer text-left bg-gradient-to-br from-white to-[#E8F1FF]"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#418CC3] rounded-xl flex items-center justify-center flex-shrink-0">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#1B1C1E] mb-1">빠른 기록</h3>
                <p className="text-sm text-[#6B6D70]">
                  간단하게 오늘의 활동 기록하기
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* 진행중인 스페이스 목록 (삭제 가능) */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">진행중인 스페이스</h3>
            <button onClick={() => queryClient.invalidateQueries({ queryKey: ['my-spaces'] })} className="text-sm text-[#6B6D70]">새로고침</button>
          </div>
          <div className="space-y-3">
            {mySpaces?.data?.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-xl">
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-[#6B6D70]">멤버 {s.member_count || 1}명</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/dashboard/reflections/history?space_id=${encodeURIComponent(s.id)}`)}
                    className="text-sm text-[#25A778] mr-2"
                  >
                    전체보기
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm('스페이스를 삭제하면 복구할 수 없습니다. 삭제하시겠습니까?')) return;
                      try {
                        const res = await fetch(`/api/v1/spaces/${s.id}`, { method: 'DELETE', headers: { 'x-user-id': localStorage.getItem('x-user-id') || 'dev-user-default' } });
                        if (!res.ok) throw new Error('삭제 실패');
                        toast.success('스페이스가 삭제되었습니다');
                        queryClient.invalidateQueries({ queryKey: ['my-spaces'] });
                        queryClient.invalidateQueries({ queryKey: ['active-spaces'] });
                      } catch (e) {
                        console.error(e);
                        toast.error('삭제에 실패했습니다');
                      }
                    }}
                    className="text-sm text-red-600"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
            {!mySpaces?.data?.length && <div className="text-sm text-[#6B6D70]">진행중인 스페이스가 없습니다</div>}
          </div>
        </div>

        {/* 최근 기록 */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1B1C1E]">최근 7일 기록</h2>
            <button
              onClick={() => router.push('/dashboard/reflections/history')}
              className="text-sm text-[#25A778] hover:text-[#186D50] font-medium"
            >
              더보기 →
            </button>
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#F8F9FA] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-[#CACBCC]" />
              </div>
              <p className="text-[#6B6D70] mb-4">아직 기록이 없어요</p>
              <button
                onClick={() => {
                    router.push('/dashboard/reflections/micro');
                }}
                className="btn-primary"
              >
                첫 기록 시작하기
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log: any) => {
                const activityInfo = log.isStarReflection 
                  ? { icon: log.activity_icon || '', label: log.activity_label || 'AI 회고' }
                  : getActivityInfo(log.activity_type);
                
                return (
                  <div
                    key={log.id}
                    className="p-4 bg-[#F8F9FA] rounded-xl hover:bg-white border-2 border-transparent hover:border-[#EAEBEC] transition-all cursor-pointer group"
                  >
                    <div 
                      className="flex items-start gap-4"
                      onClick={() => router.push(`/dashboard/reflections/${log.id}`)}
                    >
                      {activityInfo.icon && <div className="text-3xl flex-shrink-0">{activityInfo.icon}</div>}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-[#1B1C1E]">{activityInfo.label}</span>
                          <span className="text-xs text-[#6B6D70]">
                            {new Date(log.date || log.created_at).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                        {log.memo && (
                          <p className="text-sm text-[#6B6D70] line-clamp-1">{log.memo}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          {log.tags?.slice(0, 3).map((tag: string) => (
                            <span key={tag} className="px-2 py-1 bg-white rounded text-xs text-[#6B6D70]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: 좋아요 토글 API 호출
                          toast.success(log.is_favorited ? '좋아요 취소' : '좋아요!');
                        }}
                        className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                          log.is_favorited 
                            ? 'text-[#DC2626] bg-red-50' 
                            : 'text-[#9CA3AF] hover:text-[#DC2626] hover:bg-red-50'
                        }`}
                      >
                        <Heart 
                          className="w-5 h-5" 
                          fill={log.is_favorited ? 'currentColor' : 'none'}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Nudge - 다음 행동 제안 */}
        {stats?.action_nudge && (
          <div className="card mt-6 bg-gradient-to-br from-[#DDF3EB] to-white border-2 border-[#25A778]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#25A778] rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#186D50] mb-2">
                  💡 다음 행동 제안
                </h3>
                <p className="text-[#186D50] mb-4">
                  {stats.action_nudge.message}
                </p>
                <div className="flex flex-wrap gap-2">
                  {stats.action_nudge.actions?.map((action: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => router.push(action.link)}
                      className="px-4 py-2 bg-white text-[#25A778] rounded-lg text-sm font-medium hover:bg-[#F8F9FA] transition-all"
                    >
                      {action.label} →
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 팀 초대 모달 제거: 스페이스 생성에서 초대 기능 제공 */}
      </div>
    </div>
  );
}
