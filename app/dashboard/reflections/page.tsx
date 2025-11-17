'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Plus, Sparkles, TrendingUp, Calendar, BookOpen, Heart, Target } from 'lucide-react';

export default function ReflectionsPage() {
  const router = useRouter();

  // 최근 마이크로 로그
  const { data: recentLogs } = useQuery({
    queryKey: ['micro-logs-recent'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/api/reflections/micro?limit=7', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-user-id': localStorage.getItem('x-user-id') || '',
        },
      });
      return response.json();
    },
  });

  // 이번주 통계
  const { data: weekStats } = useQuery({
    queryKey: ['week-stats'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/api/reflections/stats?period=week', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-user-id': localStorage.getItem('x-user-id') || '',
        },
      });
      return response.json();
    },
  });

  // 사용자 baseline 체크
  const needsBaseline = !localStorage.getItem('baseline_mood');
  const logs = recentLogs?.data || [];
  const stats = weekStats?.data;

  return (
    <div className="min-h-screen bg-[#F1F2F3]">
      <div className="max-w-6xl mx-auto p-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1B1C1E] mb-2">성장 회고</h1>
              <p className="text-[#6B6D70]">경험을 기록하고, 성장 패턴을 발견하세요</p>
            </div>
            
            <button
              onClick={() => {
                if (needsBaseline) {
                  router.push('/dashboard/reflections/baseline');
                } else {
                  router.push('/dashboard/reflections/micro');
                }
              }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>간단하게 회고하기</span>
            </button>
          </div>

          {/* Baseline 설정 필요 알림 */}
          {needsBaseline && (
            <div className="bg-gradient-to-r from-[#DDF3EB] to-[#E8F1FF] rounded-xl p-6 border-2 border-[#25A778]/30 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-[#25A778]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#186D50] mb-2">
                    시작하기 전에 간단한 설정이 필요해요
                  </h3>
                  <p className="text-sm text-[#186D50] mb-3">
                    님의 평소 기분을 알려주시면, 더 정확한 분석과 추천을 해드릴 수 있어요 (30초 소요)
                  </p>
                  <button
                    onClick={() => router.push('/dashboard/reflections/baseline')}
                    className="px-4 py-2 bg-white text-[#25A778] rounded-lg font-medium hover:bg-[#F8F9FA] transition-all"
                  >
                    지금 설정하기 →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* 이번 주 통계 */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-[#25A778]" />
              <h3 className="font-bold text-[#1B1C1E]">이번 주</h3>
            </div>
            <div className="text-3xl font-bold text-[#25A778] mb-1">
              {stats?.total_logs || 0}개
            </div>
            <p className="text-sm text-[#6B6D70]">활동 기록</p>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-[#DC2626]" />
              <h3 className="font-bold text-[#1B1C1E]">좋았던 경험</h3>
            </div>
            <div className="text-3xl font-bold text-[#DC2626] mb-1">
              {stats?.positive_logs || 0}개
            </div>
            <p className="text-sm text-[#6B6D70]">평소보다 기분 좋았던 날</p>
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
            onClick={() => {
              if (needsBaseline) {
                router.push('/dashboard/reflections/baseline');
              } else {
                router.push('/dashboard/reflections/micro');
              }
            }}
            className="card hover:shadow-lg transition-all cursor-pointer text-left bg-gradient-to-br from-white to-[#DDF3EB]"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#25A778] rounded-xl flex items-center justify-center flex-shrink-0">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#1B1C1E] mb-1">초라이트 기록</h3>
                <p className="text-sm text-[#6B6D70]">
                  1분 안에 빠르게 오늘의 활동 기록하기
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/dashboard/reflections/story')}
            className="card hover:shadow-lg transition-all cursor-pointer text-left bg-gradient-to-br from-white to-[#E8F1FF]"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#418CC3] rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#1B1C1E] mb-1">나의 성장 스토리</h3>
                <p className="text-sm text-[#6B6D70]">
                  최근 활동을 분석한 스토리 보기
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* 최근 기록 */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1B1C1E]">최근 7일 기록</h2>
            <button
              onClick={() => router.push('/dashboard/reflections/history')}
              className="text-sm text-[#25A778] hover:text-[#186D50] font-medium"
            >
              전체보기 →
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
                  if (needsBaseline) {
                    router.push('/dashboard/reflections/baseline');
                  } else {
                    router.push('/dashboard/reflections/micro');
                  }
                }}
                className="btn-primary"
              >
                첫 기록 시작하기
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log: any) => (
                <div
                  key={log.id}
                  className="p-4 bg-[#F8F9FA] rounded-xl hover:bg-white border-2 border-transparent hover:border-[#EAEBEC] transition-all cursor-pointer"
                  onClick={() => router.push(`/dashboard/reflections/${log.id}`)}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl flex-shrink-0">{log.activity_icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-[#1B1C1E]">{log.activity_label}</span>
                        <span className="text-xs text-[#6B6D70]">
                          {new Date(log.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                      {log.memo && (
                        <p className="text-sm text-[#6B6D70] line-clamp-1">{log.memo}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {log.tags?.map((tag: string) => (
                          <span key={tag} className="px-2 py-1 bg-white rounded text-xs text-[#6B6D70]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-2xl flex-shrink-0">
                      {log.mood_emoji}
                    </div>
                  </div>
                </div>
              ))}
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
      </div>
    </div>
  );
}
