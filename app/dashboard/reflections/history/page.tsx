'use client';

import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Heart, Filter, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const getActivityInfo = (activityType: string) => {
  const map: Record<string, { icon: string; label: string }> = {
    contest: { icon: '🏆', label: '공모전' },
    club: { icon: '👥', label: '동아리' },
    project: { icon: '💻', label: '프로젝트' },
    internship: { icon: '💼', label: '인턴' },
    study: { icon: '📚', label: '스터디' },
    etc: { icon: '✨', label: '기타' },
  };
  return map[activityType] || { icon: '✨', label: '활동' };
};

export default function ReflectionHistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('filter');
  const spaceIdParam = searchParams.get('space_id');
  
  const [filter, setFilter] = useState<'all' | 'week' | 'favorites'>(
    (filterParam as any) || 'all'
  );

  const queryClient = useQueryClient();

  // 선택된 스페이스 정보(선택 시 전체보기/삭제 가능하도록)
  const { data: spaceInfo } = useQuery({
    queryKey: ['space', spaceIdParam],
    enabled: !!spaceIdParam,
    queryFn: async () => {
      const response = await fetch(`/api/v1/spaces/${spaceIdParam}`, {
        headers: { 'x-user-id': localStorage.getItem('x-user-id') || 'dev-user-default' },
      });
      if (!response.ok) throw new Error('스페이스를 불러올 수 없습니다');
      const json = await response.json();
      // 백엔드 응답이 { data: {...} } 또는 직접 객체일 수 있으므로 정규화
      if (json && typeof json === 'object') {
        if (json.data) return json.data;
        if (json.spaces) return Array.isArray(json.spaces) ? json.spaces[0] : json.spaces;
      }
      return json;
    },
  });

  // 전체 마이크로 로그
  const { data: allLogs } = useQuery({
    queryKey: ['micro-logs-all'],
    queryFn: async () => {
      const response = await fetch('/api/v1/reflections/micro?limit=100', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-user-id': localStorage.getItem('x-user-id') || 'dev-user-default',
        },
      });
      return response.json();
    },
  });

  // 전체 STAR 회고
  const { data: allStarReflections } = useQuery({
    queryKey: ['star-reflections-all'],
    queryFn: async () => {
      const response = await fetch('/api/v1/reflections?limit=100', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-user-id': localStorage.getItem('x-user-id') || 'dev-user-default',
        },
      });
      return response.json();
    },
  });

  // 마이크로 로그와 STAR 회고 합치기
  const microLogs = allLogs?.data?.logs || [];
  const starReflectionsList = allStarReflections?.data?.reflections || [];
  
  const starLogs = starReflectionsList.map((reflection: any) => {
    let memoText = '';
    if (reflection.answers && typeof reflection.answers === 'object') {
      const answerValues = Object.values(reflection.answers);
      if (answerValues.length > 0) {
        memoText = String(answerValues[0]).substring(0, 150);
      }
    }
    
    if (!memoText && reflection.ai_feedback) {
      memoText = String(reflection.ai_feedback).substring(0, 150);
    } else if (!memoText && reflection.content) {
      memoText = String(reflection.content).substring(0, 150);
    }
    
    return {
      id: reflection.id,
      activity_type: 'reflection',
      activity_label: reflection.template_name || 'AI 회고',
      activity_icon: '🤖',
      memo: memoText,
      date: reflection.created_at,
      space_id: reflection.space_id || null,
      tags: reflection.competencies || [],
      isStarReflection: true,
      is_favorited: reflection.is_favorited || false,
    };
  });
  
  // 전체 로그 합치기
  const allLogsData = [...microLogs, ...starLogs]
    .sort((a, b) => new Date(b.date || b.created_at).getTime() - new Date(a.date || a.created_at).getTime());

  // 필터링 (스페이스 선택 시 해당 스페이스로 제한)
  const getFilteredLogs = () => {
    let data = allLogsData;

    // space_id가 쿼리에 있으면 필터링 적용
    if (spaceIdParam) {
      data = data.filter((l: any) => {
        const sid = l.space_id || l.spaceId || l.space || null;
        return sid === spaceIdParam;
      });
    }

    if (filter === 'favorites') {
      return data.filter((log: any) => log.is_favorited);
    }

    if (filter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return data.filter((log: any) => {
        const logDate = new Date(log.date || log.created_at);
        return logDate >= weekAgo;
      });
    }

    return data;
  };

  const filteredLogs = getFilteredLogs();

  return (
    <div className="min-h-screen bg-[#F1F2F3]">
      <div className="max-w-4xl mx-auto p-8">
        {/* 헤더 */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard/reflections')}
            className="flex items-center gap-2 text-[#6B6D70] hover:text-[#1B1C1E] mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>돌아가기</span>
          </button>
          <h1 className="text-3xl font-bold text-[#1B1C1E] mb-2">전체 기록</h1>
          <p className="text-[#6B6D70]">나의 모든 경험 기록을 확인하세요</p>
          {spaceIdParam && spaceInfo && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-[#EAEBEC] flex items-center justify-between">
              <div>
                <div className="text-sm text-[#6B6D70]">스페이스</div>
                <div className="font-bold text-lg">{spaceInfo.name}</div>
                {spaceInfo.description && <div className="text-xs text-[#6B6D70] truncate max-w-xl">{spaceInfo.description}</div>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(`/dashboard/spaces/${spaceIdParam}`)}
                  className="px-3 py-2 bg-white border rounded text-sm"
                >
                  스페이스 페이지
                </button>
                <button
                  onClick={async () => {
                    if (!confirm('스페이스를 삭제하면 복구할 수 없습니다. 삭제하시겠습니까?')) return;
                    try {
                      const res = await fetch(`/api/v1/spaces/${spaceIdParam}`, { method: 'DELETE', headers: { 'x-user-id': localStorage.getItem('x-user-id') || 'dev-user-default' } });
                      if (!res.ok) throw new Error('삭제 실패');
                      toast.success('스페이스가 삭제되었습니다');
                      queryClient.invalidateQueries({ queryKey: ['my-spaces'] });
                      queryClient.invalidateQueries({ queryKey: ['active-spaces'] });
                      router.push('/dashboard/reflections');
                    } catch (err) {
                      console.error(err);
                      toast.error('스페이스 삭제에 실패했습니다');
                    }
                  }}
                  className="px-3 py-2 text-sm text-red-600 border rounded"
                >
                  스페이스 삭제
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 필터 */}
        <div className="flex items-center gap-3 mb-6">
          <Filter className="w-5 h-5 text-[#6B6D70]" />
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-[#25A778] text-white'
                : 'bg-white text-[#6B6D70] hover:bg-[#F8F9FA]'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilter('week')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              filter === 'week'
                ? 'bg-[#25A778] text-white'
                : 'bg-white text-[#6B6D70] hover:bg-[#F8F9FA]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            이번 주
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              filter === 'favorites'
                ? 'bg-[#DC2626] text-white'
                : 'bg-white text-[#6B6D70] hover:bg-[#F8F9FA]'
            }`}
          >
            <Heart className="w-4 h-4" />
            좋아요
          </button>
        </div>

        {/* 기록 목록 */}
        <div className="card">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#6B6D70] mb-4">
                {filter === 'favorites' && '좋아요한 기록이 없어요'}
                {filter === 'week' && '이번 주 기록이 없어요'}
                {filter === 'all' && '아직 기록이 없어요'}
              </p>
              <button
                onClick={() => router.push('/dashboard/reflections/micro')}
                className="btn-primary"
              >
                첫 기록 시작하기
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.map((log: any) => {
                const activityInfo = log.isStarReflection 
                  ? { icon: log.activity_icon || '🤖', label: log.activity_label || 'AI 회고' }
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
                            {new Date(log.date || log.created_at).toLocaleDateString('ko-KR', { 
                              year: 'numeric',
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        {log.memo && (
                          <p className="text-sm text-[#6B6D70] line-clamp-2">{log.memo}</p>
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
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (!confirm('이 기록을 삭제하시겠습니까?')) return;
                            try {
                              const endpoint = log.isStarReflection ? `/api/v1/reflections/${log.id}` : `/api/v1/reflections/micro/${log.id}`;
                              const res = await fetch(endpoint, { method: 'DELETE', headers: { 'x-user-id': localStorage.getItem('x-user-id') || 'dev-user-default' } });
                              if (!res.ok) throw new Error('삭제 실패');
                              toast.success('기록이 삭제되었습니다');
                              // 무효화
                              queryClient.invalidateQueries({ queryKey: ['micro-logs-all'] });
                              queryClient.invalidateQueries({ queryKey: ['star-reflections-all-summary'] });
                              queryClient.invalidateQueries({ queryKey: ['micro-logs-all-summary'] });
                              queryClient.invalidateQueries({ queryKey: ['micro-logs-recent'] });
                              queryClient.invalidateQueries({ queryKey: ['star-reflections-recent'] });
                            } catch (err) {
                              console.error(err);
                              toast.error('삭제에 실패했습니다');
                            }
                          }}
                          className="flex-shrink-0 p-2 rounded-lg text-sm text-red-600"
                        >
                          삭제
                        </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 통계 */}
        {filteredLogs.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="card text-center">
              <div className="text-2xl font-bold text-[#25A778]">{filteredLogs.length}</div>
              <div className="text-sm text-[#6B6D70]">전체 기록</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-[#DC2626]">
                {filteredLogs.filter((log: any) => log.is_favorited).length}
              </div>
              <div className="text-sm text-[#6B6D70]">좋아요</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-[#418CC3]">
                {filteredLogs.filter((log: any) => log.isStarReflection).length}
              </div>
              <div className="text-sm text-[#6B6D70]">AI 회고</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
