'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Smile, Frown, Meh, SmilePlus, Annoyed, ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';

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

  const { data: reflectionData, isLoading } = useQuery({
    queryKey: ['reflection', reflectionId],
    queryFn: async () => {
      const response = await fetch(`/api/reflections/${reflectionId}`, {
        headers: {
          'x-user-id': localStorage.getItem('x-user-id') || '',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch reflection');
      return response.json();
    },
  });

  const reflection: ReflectionDetail | undefined = reflectionData?.data;

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
