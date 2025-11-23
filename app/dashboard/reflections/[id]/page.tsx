'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Smile, Frown, Meh, SmilePlus, Annoyed, ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReflectionDetail {
  id: string;
  log_id: string;
  log_title: string;
  project_id: string;
  project_name: string;
  cycle: string;
  content: string;
  answers: { question: string; answer: string }[];
  mood: string;
  progress_score: number;
  ai_feedback: string;
  ai_suggestions: string[];
  extracted_keywords: string[];
  created_at: string;
}

const cycleLabels = {
  daily: '일간',
  weekly: '주간',
  biweekly: '격주',
  monthly: '월간',
};

const moodIcons: { [key: string]: any } = {
  great: SmilePlus,
  good: Smile,
  normal: Meh,
  bad: Frown,
  terrible: Annoyed,
};

const moodLabels = {
  great: '매우 좋음',
  good: '좋음',
  normal: '보통',
  bad: '안좋음',
  terrible: '매우 안좋음',
};

export default function ReflectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reflectionId = params.id as string;
  const queryClient = useQueryClient();

  // 만약 라우팅 충돌로 인해 'history'가 id로 들어오는 경우, 정식 히스토리 페이지로 리다이렉트
  useEffect(() => {
    if (reflectionId === 'history') {
      router.replace(`/dashboard/reflections/history`);
    }
  }, [reflectionId, router]);

  const { data: reflectionData, isLoading } = useQuery({
    queryKey: ['reflection', reflectionId],
    queryFn: async () => {
      // 먼저 AI 회고 목록에서 찾기
      const reflectionsResponse = await fetch(`/api/v1/reflections`, {
        headers: {
          'x-user-id': localStorage.getItem('x-user-id') || 'dev-user-default',
        },
      });
      
      if (reflectionsResponse.ok) {
        const result = await reflectionsResponse.json();
        const reflections = result?.data?.reflections || [];
        const reflection = reflections.find((r: any) => r.id === reflectionId);
        
        if (reflection) {
          // AI 회고인 경우 결과 페이지로 리다이렉트
          sessionStorage.setItem('reflection_result', JSON.stringify({
            template: reflection.template_id,
            templateName: reflection.template_name,
            answers: reflection.answers,
            competencies: reflection.competency_analysis?.competencies || [],
            summary: reflection.competency_analysis?.summary
          }));
          router.push('/dashboard/reflections/result');
          return null;
        }
      }
      
      // 빠른 기록(마이크로 로그)에서 찾기
      const microResponse = await fetch(`/api/v1/reflections/micro?limit=100`, {
        headers: {
          'x-user-id': localStorage.getItem('x-user-id') || 'dev-user-default',
        },
      });
      
      if (microResponse.ok) {
        const result = await microResponse.json();
        const microLogs = result?.data?.logs || [];
        const microLog = microLogs.find((log: any) => log.id === reflectionId);
        
        if (microLog) {
          return microLog;
        }
      }
      
      return null;
    },
  });

  const reflection: ReflectionDetail | undefined = reflectionData?.data || reflectionData;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1F2F3] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#25A778]"></div>
          <p className="mt-4 text-[#6B6D70]">회고를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!reflection) {
    return (
      <div className="min-h-screen bg-[#F1F2F3] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6B6D70]">회고를 찾을 수 없습니다</p>
          <button onClick={() => router.back()} className="btn-primary mt-4">
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 빠른 기록인 경우
  const isMicroLog = reflection.activity_type !== undefined;
  const activityLabels: Record<string, string> = {
    lecture: '강의 / 팀플',
    club: '학회 / 동아리',
    contest: '공모전 / 프로젝트',
    intern: '인턴 / 아르바이트',
    study: '자격증 / 공부',
    other: '기타',
  };

  if (isMicroLog) {
    return (
      <div className="min-h-screen bg-[#F1F2F3]">
        <div className="max-w-4xl mx-auto p-8">
          {/* 헤더 */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#6B6D70] hover:text-[#1B1C1E] mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              돌아가기
            </button>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#E8F1FF] text-[#418CC3]">
                빠른 기록
              </span>
              <span className="text-sm text-[#6B6D70]">
                {new Date(reflection.date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-[#1B1C1E]">
              {activityLabels[reflection.activity_type] || '활동 기록'}
            </h1>
          </div>

          {/* 기록 내용 */}
          {reflection.memo && (
            <div className="card mb-6">
              <h2 className="text-xl font-semibold text-[#1B1C1E] mb-4">기록 내용</h2>
              <p className="text-[#1B1C1E] leading-relaxed whitespace-pre-wrap">
                {reflection.memo}
              </p>
            </div>
          )}

          {/* 감정 상태 */}
          {reflection.mood_compare && (
            <div className="card mb-6">
              <h2 className="text-xl font-semibold text-[#1B1C1E] mb-4">평소 대비 기분</h2>
              <div className="flex items-center gap-3">
                {reflection.mood_compare === 'better' && (
                  <>
                    <SmilePlus className="w-10 h-10 text-[#25A778]" />
                    <span className="text-xl font-semibold text-[#25A778]">평소보다 더 좋았다</span>
                  </>
                )}
                {reflection.mood_compare === 'same' && (
                  <>
                    <Meh className="w-10 h-10 text-[#6B6D70]" />
                    <span className="text-xl font-semibold text-[#6B6D70]">평소랑 비슷했다</span>
                  </>
                )}
                {reflection.mood_compare === 'worse' && (
                  <>
                    <Frown className="w-10 h-10 text-[#DC2626]" />
                    <span className="text-xl font-semibold text-[#DC2626]">평소보다 더 별로였다</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* 이유 */}
          {reflection.reason && (
            <div className="card mb-6">
              <h2 className="text-xl font-semibold text-[#1B1C1E] mb-4">
                {reflection.mood_compare === 'better' ? '좋았던 이유' : '힘들었던 이유'}
              </h2>
              <div className="bg-[#F8F9FA] p-4 rounded-lg">
                <p className="text-[#1B1C1E]">
                  {reflection.reason === 'communication' && '사람들과 의견 주고받는 게 재밌었다'}
                  {reflection.reason === 'creativity' && '아이디어가 떠오르는 게 짜릿했다'}
                  {reflection.reason === 'problem_solving' && '문제가 깔끔하게 해결되는 게 시원했다'}
                  {reflection.reason === 'helping' && '누군가에게 도움이 된 느낌이 좋았다'}
                  {reflection.reason === 'achievement' && '결과/성과가 나오는 게 뿌듯했다'}
                  {reflection.reason === 'conflict' && '사람들 사이 조율/갈등'}
                  {reflection.reason === 'no_idea' && '아이디어가 안 떠오름'}
                  {reflection.reason === 'data_work' && '숫자·자료 처리'}
                  {reflection.reason === 'time_energy' && '시간·체력 소모'}
                  {reflection.reason === 'no_meaning' && '내가 왜 이걸 해야 하는지 모르겠는 느낌'}
                </p>
              </div>
            </div>
          )}

          {/* 태그 */}
          {reflection.tags && reflection.tags.length > 0 && (
            <div className="card mb-6">
              <h2 className="text-xl font-semibold text-[#1B1C1E] mb-4">AI 분석 태그</h2>
              <div className="flex flex-wrap gap-2">
                {reflection.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#DDF3EB] text-[#186D50]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-3">
          <button onClick={() => router.back()} className="btn-secondary flex-1">
            목록으로
          </button>
          <button
            onClick={async () => {
              if (!confirm('이 회고를 삭제하시겠습니까?')) return;
              try {
                // 마이크로 로그인지 확인
                const endpoint = reflection.activity_type ? `/api/v1/reflections/micro/${reflection.id}` : `/api/v1/reflections/${reflectionId}`;
                const res = await fetch(endpoint, { method: 'DELETE', headers: { 'x-user-id': localStorage.getItem('x-user-id') || 'dev-user-default' } });
                if (!res.ok) throw new Error('삭제 실패');
                toast.success('회고가 삭제되었습니다');
                queryClient.invalidateQueries({ queryKey: ['micro-logs-recent'] });
                queryClient.invalidateQueries({ queryKey: ['star-reflections-recent'] });
                router.push('/dashboard/reflections');
              } catch (err) {
                console.error(err);
                toast.error('삭제에 실패했습니다');
              }
            }}
            className="btn-secondary flex-1 text-red-600"
          >
            삭제
          </button>
          </div>
        </div>
      </div>
    );
  }

  // AI 회고인 경우 (기존 코드)
  return (
    <div className="min-h-screen bg-[#F1F2F3]">
      <div className="max-w-4xl mx-auto p-8">
        {/* 헤더 */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#6B6D70] hover:text-[#1B1C1E] mb-4 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            돌아가기
          </button>
          <div className="flex items-center gap-3 mb-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: '#DDF3EB', color: '#186D50' }}
            >
              {cycleLabels[reflection.cycle as keyof typeof cycleLabels]} 회고
            </span>
            <span className="text-sm text-[#6B6D70]">
              {new Date(reflection.created_at).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[#1B1C1E]">
            {reflection.project_name}
          </h1>
        </div>

        {/* 기분 & 진행도 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* 기분 */}
          <div className="card">
            <h2 className="text-sm font-medium text-[#6B6D70] mb-3">
              오늘의 기분
            </h2>
            <div className="flex items-center gap-3">
              {(() => {
                const MoodIcon = moodIcons[reflection.mood as keyof typeof moodIcons];
                return MoodIcon ? <MoodIcon className="w-10 h-10" style={{ color: '#25A778' }} /> : null;
              })()}
              <span className="text-xl font-semibold text-[#1B1C1E]">
                {moodLabels[reflection.mood as keyof typeof moodLabels]}
              </span>
            </div>
          </div>

          {/* 진행도 */}
          <div className="card">
            <h2 className="text-sm font-medium text-[#6B6D70] mb-3">
              오늘의 진행도
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-3 bg-[#F1F2F3] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#25A778] rounded-full transition-all"
                    style={{ width: `${reflection.progress_score * 10}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-2xl font-bold text-[#25A778]">
                {reflection.progress_score}/10
              </span>
            </div>
          </div>
        </div>

        {/* 회고 질문 답변 */}
        {reflection.answers && reflection.answers.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-[#1B1C1E] mb-6">
              회고 질문 답변
            </h2>
            <div className="space-y-6">
              {reflection.answers.map((answer, index) => (
                <div key={index}>
                  <h3 className="text-sm font-medium text-[#6B6D70] mb-2">
                    {index + 1}. {answer.question}
                  </h3>
                  <p className="text-[#1B1C1E] bg-[#F1F2F3] p-4 rounded-lg">
                    {answer.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 자유 회고 */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-[#1B1C1E] mb-4">
            자유 회고
          </h2>
          <div className="text-[#1B1C1E] whitespace-pre-wrap leading-relaxed">
            {reflection.content}
          </div>
        </div>

        {/* 추출된 키워드 */}
        {reflection.extracted_keywords &&
          reflection.extracted_keywords.length > 0 && (
            <div className="card mb-6">
              <h2 className="text-xl font-semibold text-[#1B1C1E] mb-4">
                추출된 키워드
              </h2>
              <div className="flex flex-wrap gap-2">
                {reflection.extracted_keywords.map((keyword, index) => {
                  const colors = [
                    { bg: '#E8F1FF', text: '#418CC3' },
                    { bg: '#F0E8FF', text: '#9C6BB3' },
                    { bg: '#FFF3C2', text: '#D77B0F' },
                  ];
                  const color = colors[index % 3];
                  return (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium"
                      style={{
                        backgroundColor: color.bg,
                        color: color.text,
                      }}
                    >
                      {keyword}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

        {/* AI 피드백 */}
        <div className="card mb-6 border-2 border-[#25A778]/20">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-[#25A778] rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-[#1B1C1E] mb-1">
                AI 피드백
              </h2>
              <p className="text-sm text-[#6B6D70]">
                당신의 회고를 분석한 맞춤 피드백입니다
              </p>
            </div>
          </div>
          <div className="bg-[#DDF3EB] p-6 rounded-xl">
            <p className="text-[#186D50] leading-relaxed whitespace-pre-wrap">
              {reflection.ai_feedback}
            </p>
          </div>
        </div>

        {/* AI 제안 */}
        {reflection.ai_suggestions && reflection.ai_suggestions.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-[#1B1C1E] mb-4">
              개선 제안
            </h2>
            <ul className="space-y-3">
              {reflection.ai_suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#25A778] rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="flex-1 text-[#1B1C1E] pt-0.5">{suggestion}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 버튼 */}
        <div className="flex gap-3">
          <button onClick={() => router.back()} className="btn-secondary flex-1">
            목록으로
          </button>
          <button
            onClick={() =>
              router.push(`/dashboard/reflections/${reflectionId}/edit`)
            }
            className="btn-primary flex-1"
          >
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
}
