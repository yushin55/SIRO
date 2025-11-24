'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Users, Calendar, TrendingUp, Settings, UserPlus, Mail, Link as LinkIcon, ArrowLeft, Heart } from 'lucide-react';
import TeamInviteModal from '@/components/TeamInviteModal';

interface Space {
  id: string;
  name: string;
  description: string;
  type: string;
  start_date: string;
  end_date: string;
  reflection_cycle: string;
  next_reflection_date: string;
  total_reflections: number;
  expected_reflections: number;
  reminder_enabled: boolean;
  status: string;
  created_at: string;
}

interface TeamMember {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}

interface HealthCheck {
  user_id: string;
  user_name: string;
  health_score: number;
  date: string;
  created_at: string;
}

export default function SpaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const spaceId = params.id as string;

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showInviteLink, setShowInviteLink] = useState(false);

  // 현재 스페이스 ID를 localStorage에 저장 (회고 작성 시 사용)
  useEffect(() => {
    if (spaceId) {
      localStorage.setItem('current-space-id', spaceId);
    }
  }, [spaceId]);

  // 스페이스 정보 조회
  const { data: space, isLoading: spaceLoading } = useQuery({
    queryKey: ['space', spaceId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/spaces/${spaceId}`, {
        headers: {
          'x-user-id': localStorage.getItem('x-user-id') || 'dev-user-default',
        },
      });
      if (!response.ok) throw new Error('스페이스를 찾을 수 없습니다');
      return response.json() as Promise<Space>;
    },
  });

  // 팀원 목록 조회 (TODO: 백엔드 구현 필요)
  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ['space-members', spaceId],
    enabled: !!spaceId,
    initialData: [
      {
        id: '1',
        user_id: 'dev-user-default',
        name: '나',
        email: 'me@example.com',
        role: 'owner' as const,
        joined_at: new Date().toISOString(),
      },
    ] as TeamMember[],
    queryFn: async () => {
      // TODO: 백엔드 API 구현 후 활성화
      // const response = await fetch(`/api/v1/spaces/${spaceId}/members`, {
      //   headers: {
      //     'x-user-id': localStorage.getItem('x-user-id') || 'dev-user-default',
      //   },
      // });
      // if (!response.ok) throw new Error('팀원 목록을 불러올 수 없습니다');
      // return response.json() as Promise<TeamMember[]>;
      
      // 현재 캐시된 데이터 반환 (초대로 추가된 임시 팀원 포함)
      const cached = queryClient.getQueryData(['space-members', spaceId]) as TeamMember[] || [];
      return cached.length > 0 ? cached : [
        {
          id: '1',
          user_id: 'dev-user-default',
          name: '나',
          email: 'me@example.com',
          role: 'owner' as const,
          joined_at: new Date().toISOString(),
        },
      ] as TeamMember[];
    },
  });

  // 회고 목록 조회 (간략)
  const { data: reflections } = useQuery({
    queryKey: ['space-reflections', spaceId],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/v1/reflections?space_id=${spaceId}&limit=5`, {
          headers: {
            'x-user-id': localStorage.getItem('x-user-id') || 'dev-user-default',
          },
        });
        if (!response.ok) return [];
        const result = await response.json();
        // 백엔드가 { data: { reflections: [...] } } 구조로 반환
        return result.data?.reflections || [];
      } catch (error) {
        console.log('회고 조회 실패, 빈 배열 반환:', error);
        return [];
      }
    },
  });

  // 팀원 컨디션 조회
  const { data: teamHealth } = useQuery({
    queryKey: ['space-health', spaceId],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/v1/spaces/${spaceId}/health`, {
          headers: {
            'x-user-id': localStorage.getItem('x-user-id') || 'dev-user-default',
          },
        });
        if (!response.ok) return { data: [], average_score: 0 };
        const result = await response.json();
        return result;
      } catch (error) {
        console.log('팀 컨디션 조회 실패:', error);
        return { data: [], average_score: 0 };
      }
    },
    refetchInterval: 60000, // 1분마다 자동 새로고침
  });

  const typeLabels: Record<string, string> = {
    contest: '공모전',
    project: '프로젝트',
    club: '동아리',
    internship: '인턴십',
  };

  const cycleLabels: Record<string, string> = {
    daily: '매일',
    weekly: '주 1회',
    biweekly: '2주 1회',
    monthly: '월 1회',
  };

  const inviteLink = typeof window !== 'undefined' ? `${window.location.origin}/invite/${spaceId}` : '';

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success('초대 링크가 복사되었습니다!');
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('링크 복사에 실패했습니다');
    }
  };

  if (spaceLoading) {
    return (
      <div className="min-h-screen bg-[#F1F2F3] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#25A778]" />
      </div>
    );
  }

  if (!space) {
    return (
      <div className="min-h-screen bg-[#F1F2F3] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-[#6B6D70] mb-4">스페이스를 찾을 수 없습니다</p>
          <button onClick={() => router.push('/dashboard/reflection-home')} className="btn-primary">
            회고 홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const progress = space.expected_reflections > 0 
    ? (space.total_reflections / space.expected_reflections) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-[#F1F2F3]">
      <div className="max-w-6xl mx-auto p-8">
        {/* 헤더 */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard/reflection-home')}
            className="flex items-center gap-2 text-[#6B6D70] hover:text-[#1B1C1E] mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            회고 홈으로
          </button>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-sm px-2 py-1 bg-[#F1F2F3] rounded text-[#6B6D70]">
                  {typeLabels[space.type]}
                </div>
                <h1 className="text-3xl font-bold text-[#1B1C1E]">{space.name}</h1>
              </div>
              {space.description && (
                <p className="text-[#6B6D70] mb-4">{space.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-[#6B6D70]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(space.start_date).toLocaleDateString()} ~ {space.end_date ? new Date(space.end_date).toLocaleDateString() : '진행중'}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  회고 주기: {cycleLabels[space.reflection_cycle]}
                </span>
              </div>
            </div>
            
            <button className="btn-secondary flex items-center gap-2">
              <Settings className="w-4 h-4" />
              설정
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 진행 현황 */}
            <div className="bg-white rounded-2xl p-6 border border-[#EAEBEC]">
              <h2 className="text-lg font-bold text-[#1B1C1E] mb-4">진행 현황</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-[#F8F9FA] rounded-xl">
                  <div className="text-2xl font-bold text-[#25A778] mb-1">
                    {space.total_reflections}
                  </div>
                  <div className="text-xs text-[#6B6D70]">작성한 회고</div>
                </div>
                <div className="text-center p-4 bg-[#F8F9FA] rounded-xl">
                  <div className="text-2xl font-bold text-[#418CC3] mb-1">
                    {space.expected_reflections}
                  </div>
                  <div className="text-xs text-[#6B6D70]">예상 회고</div>
                </div>
                <div className="text-center p-4 bg-[#F8F9FA] rounded-xl">
                  <div className="text-2xl font-bold text-[#9C6BB3] mb-1">
                    {Math.round(progress)}%
                  </div>
                  <div className="text-xs text-[#6B6D70]">달성률</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-[#1B1C1E]">전체 진행도</span>
                  <span className="text-sm text-[#6B6D70]">{space.total_reflections} / {space.expected_reflections}회</span>
                </div>
                <div className="h-3 bg-[#F1F2F3] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#25A778] to-[#2DC98E] transition-all duration-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>

              {space.next_reflection_date && (
                <div className="p-4 bg-[#DDF3EB] rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-[#186D50] font-medium mb-1">다음 회고 예정일</div>
                      <div className="text-lg font-bold text-[#1B1C1E]">
                        {new Date(space.next_reflection_date).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/dashboard/reflections/history?space_id=${encodeURIComponent(spaceId)}`)}
                      className="btn-primary"
                    >
                      회고 작성하기
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 최근 회고 */}
            <div className="bg-white rounded-2xl p-6 border border-[#EAEBEC]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#1B1C1E]">최근 회고</h2>
                <button
                  onClick={() => router.push(`/dashboard/reflections?space_id=${spaceId}`)}
                  className="text-sm text-[#25A778] hover:text-[#186D50] font-medium"
                >
                  전체보기
                </button>
              </div>

              {reflections && reflections.length > 0 ? (
                <div className="space-y-3">
                  {reflections.slice(0, 5).map((reflection: any) => (
                    <div
                      key={reflection.id}
                      className="p-4 bg-[#F8F9FA] rounded-xl hover:bg-[#EAEBEC] transition-colors cursor-pointer"
                      onClick={() => router.push(`/dashboard/reflections/${reflection.id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#1B1C1E]">
                            {new Date(reflection.reflection_date || reflection.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {reflection.progress_score && (
                          <span className="text-xs px-2 py-1 bg-[#25A778]/10 text-[#25A778] rounded-full font-medium">
                            {reflection.progress_score}점
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#6B6D70] line-clamp-2">
                        {reflection.content || reflection.ai_feedback || '회고 내용'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#6B6D70] mb-4">아직 작성된 회고가 없습니다</p>
                  <button
                    onClick={() => router.push('/dashboard/reflections/survey')}
                    className="btn-primary"
                  >
                    첫 회고 작성하기
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 팀원 관리 */}
            <div className="bg-white rounded-2xl p-6 border border-[#EAEBEC]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#1B1C1E] flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  팀원
                </h2>
                <span className="text-sm font-medium text-[#6B6D70]">
                  {members?.length || 0}명
                </span>
              </div>

              {/* 팀원 목록 with 컨디션 */}
              <div className="space-y-3 mb-4">
                {members?.map((member) => {
                  const healthData = teamHealth?.data?.find((h: HealthCheck) => h.user_id === member.user_id);
                  return (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#25A778] to-[#2DC98E] flex items-center justify-center text-white font-bold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[#1B1C1E] flex items-center gap-2">
                          {member.name}
                          {member.role === 'owner' && (
                            <span className="text-xs px-2 py-0.5 bg-[#25A778] text-white rounded-full">
                              방장
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#6B6D70] truncate">{member.email}</div>
                        {healthData && (
                          <div className="flex items-center gap-2 mt-1">
                            <Heart className="w-3 h-3 text-red-400" fill="currentColor" />
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-[80px]">
                              <div
                                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                                style={{ width: `${healthData.health_score}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-[#1B1C1E]">{healthData.health_score}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 팀 평균 컨디션 */}
              {teamHealth?.data && teamHealth.data.length > 0 && (
                <div className="mb-4 p-3 bg-gradient-to-br from-[#FFF7ED] to-[#FFFBF0] rounded-xl border border-[#FFDAB9]/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-400" fill="currentColor" />
                      <span className="text-sm font-medium text-[#1B1C1E]">팀 평균</span>
                    </div>
                    <span className="text-lg font-bold text-[#1B1C1E]">{teamHealth.average_score || 0}</span>
                  </div>
                </div>
              )}

              {/* 초대 버튼 */}
              <div className="space-y-2 pt-4 border-t border-[#EAEBEC]">
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  이메일로 초대하기
                </button>
                
                <button
                  onClick={() => setShowInviteLink(!showInviteLink)}
                  className="w-full btn-secondary flex items-center justify-center gap-2"
                >
                  <LinkIcon className="w-4 h-4" />
                  초대 링크 공유
                </button>

                {showInviteLink && (
                  <div className="mt-3 p-3 bg-[#F8F9FA] rounded-xl">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inviteLink}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-600 truncate"
                      />
                      <button
                        onClick={copyInviteLink}
                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
                      >
                        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-[#6B6D70] mt-2">
                      이 링크를 공유하면 누구나 스페이스에 참여할 수 있습니다
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 스페이스 정보 */}
            <div className="bg-white rounded-2xl p-6 border border-[#EAEBEC]">
              <h2 className="text-lg font-bold text-[#1B1C1E] mb-4">스페이스 정보</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6B6D70]">유형</span>
                  <span className="font-medium text-[#1B1C1E]">{typeLabels[space.type]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6D70]">회고 주기</span>
                  <span className="font-medium text-[#1B1C1E]">{cycleLabels[space.reflection_cycle]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6D70]">알림</span>
                  <span className="font-medium text-[#1B1C1E]">
                    {space.reminder_enabled ? '활성화' : '비활성화'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6D70]">생성일</span>
                  <span className="font-medium text-[#1B1C1E]">
                    {new Date(space.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6D70]">상태</span>
                  <span className={`font-medium ${space.status === 'active' ? 'text-[#25A778]' : 'text-[#6B6D70]'}`}>
                    {space.status === 'active' ? '진행중' : '완료'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 팀원 초대 모달 */}
      {showInviteModal && (
        <TeamInviteModal
          spaceId={spaceId}
          spaceName={space.name}
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => {
            setShowInviteModal(false);
            queryClient.invalidateQueries({ queryKey: ['space-members', spaceId] });
          }}
        />
      )}
    </div>
  );
}
