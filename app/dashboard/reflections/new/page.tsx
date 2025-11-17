'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Smile, Frown, Meh, SmilePlus, Annoyed, ArrowLeft, Sparkles } from 'lucide-react';

const moods = [
  { value: 'great', label: '매우 좋음', Icon: SmilePlus, color: '#25A778' },
  { value: 'good', label: '좋음', Icon: Smile, color: '#2DC98E' },
  { value: 'normal', label: '보통', Icon: Meh, color: '#6B6D70' },
  { value: 'bad', label: '안좋음', Icon: Frown, color: '#D77B0F' },
  { value: 'terrible', label: '매우 안좋음', Icon: Annoyed, color: '#DC2626' },
];

export default function NewReflectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');
  const spaceId = searchParams.get('space_id');
  const logId = searchParams.get('log_id');
  const projectId = searchParams.get('project_id');
  const cycle = searchParams.get('cycle') || 'weekly';

  const [selectedQuestion, setSelectedQuestion] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    content: '',
    answers: [] as { question: string; answer: string }[],
    mood: 'good',
    progress_score: 5,
  });

  // 템플릿 질문 가져오기
  const { data: templateData } = useQuery({
    queryKey: ['template', templateId],
    queryFn: async () => {
      if (!templateId) return null;
      const response = await fetch(`/api/templates/${templateId}`);
      return response.json();
    },
    enabled: !!templateId,
  });

  const questions = templateData?.data?.questions || [
    '오늘 무엇을 했나요?',
    '어떤 어려움이 있었나요?',
    '내일 무엇을 할 건가요?',
  ];

  const createReflectionMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/reflections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': localStorage.getItem('x-user-id') || '',
        },
        body: JSON.stringify({
          log_id: logId,
          project_id: projectId,
          cycle,
          content: data.content,
          answers: data.answers,
          mood: data.mood,
          progress_score: data.progress_score,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '회고 저장에 실패했습니다');
      }

      return response.json();
    },
    onSuccess: (data: any) => {
      toast.success('회고가 저장되었습니다!');
      router.push(`/dashboard/reflections/${data.data.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      toast.error('회고 내용을 입력해주세요');
      return;
    }

    createReflectionMutation.mutate(formData);
  };

  const handleAnswerChange = (question: string, answer: string) => {
    const existingIndex = formData.answers.findIndex(
      (a) => a.question === question
    );
    const newAnswers = [...formData.answers];

    if (existingIndex >= 0) {
      newAnswers[existingIndex] = { question, answer };
    } else {
      newAnswers.push({ question, answer });
    }

    setFormData({ ...formData, answers: newAnswers });
  };

  const getAnswerValue = (question: string) => {
    return formData.answers.find((a) => a.question === question)?.answer || '';
  };

  return (
    <div className="min-h-screen bg-[#F1F2F3]">
      <div className="max-w-4xl mx-auto p-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1B1C1E] mb-2">
            {cycle === 'daily' && '일간 회고'}
            {cycle === 'weekly' && '주간 회고'}
            {cycle === 'biweekly' && '격주 회고'}
            {cycle === 'monthly' && '월간 회고'}
          </h1>
          <p className="text-[#6B6D70]">
            오늘 하루를 돌아보고 내일을 준비하세요
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 기분 선택 */}
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-[#1B1C1E] mb-4">
              오늘의 기분
            </h2>
            <div className="grid grid-cols-5 gap-3">
              {moods.map((mood) => {
                const Icon = mood.Icon;
                return (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, mood: mood.value })}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    formData.mood === mood.value
                      ? 'border-[#25A778] bg-[#DDF3EB] shadow-md scale-105'
                      : 'border-[#EAEBEC] bg-white hover:border-[#CACBCC]'
                  }`}
                >
                  <Icon className="w-8 h-8" style={{ color: mood.color }} />
                  <span
                    className={`text-xs font-medium ${
                      formData.mood === mood.value
                        ? 'text-[#186D50]'
                        : 'text-[#6B6D70]'
                    }`}
                  >
                    {mood.label}
                  </span>
                </button>
              );})}
            </div>
          </div>

          {/* 진행도 점수 */}
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-[#1B1C1E] mb-4">
              오늘의 진행도
            </h2>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="10"
                value={formData.progress_score}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    progress_score: parseInt(e.target.value),
                  })
                }
                className="flex-1 h-2 bg-[#F1F2F3] rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #25A778 0%, #25A778 ${
                    (formData.progress_score - 1) * 11.11
                  }%, #F1F2F3 ${
                    (formData.progress_score - 1) * 11.11
                  }%, #F1F2F3 100%)`,
                }}
              />
              <div className="flex-shrink-0 w-16 h-16 bg-[#DDF3EB] rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-[#25A778]">
                  {formData.progress_score}
                </span>
              </div>
            </div>
            <div className="flex justify-between text-xs text-[#6B6D70] mt-2">
              <span>전혀 진행 안됨</span>
              <span>완벽하게 진행됨</span>
            </div>
          </div>

          {/* 회고 질문 */}
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-[#1B1C1E] mb-6">
              회고 질문
            </h2>
            <div className="space-y-6">
              {questions.map((question: string, index: number) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-[#1B1C1E] mb-2">
                    {index + 1}. {question}
                  </label>
                  <textarea
                    value={getAnswerValue(question)}
                    onChange={(e) =>
                      handleAnswerChange(question, e.target.value)
                    }
                    placeholder="답변을 입력하세요"
                    rows={3}
                    className="input-field w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 자유 회고 */}
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-[#1B1C1E] mb-2">
              자유 회고 <span className="text-red-500">*</span>
            </h2>
            <p className="text-sm text-[#6B6D70] mb-4">
              오늘 하루를 자유롭게 회고해보세요. AI가 피드백을 제공해드립니다.
            </p>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="오늘 하루를 돌아보며 느낀점, 배운점, 개선할 점 등을 자유롭게 작성해주세요..."
              rows={8}
              className="input-field w-full"
              required
            />
            <div className="flex justify-between text-xs text-[#6B6D70] mt-2">
              <span>최소 50자 이상 작성을 권장합니다</span>
              <span>{formData.content.length}자</span>
            </div>
          </div>

          {/* AI 피드백 안내 */}
          <div className="bg-[#DDF3EB] rounded-xl p-4 mb-6 border border-[#25A778]/20">
            <div className="flex items-start gap-3">
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
                <h3 className="font-medium text-[#186D50] mb-1">
                  AI 피드백이 자동으로 생성됩니다
                </h3>
                <p className="text-sm text-[#186D50]">
                  회고를 저장하면 AI가 내용을 분석하여 맞춤 피드백과 개선
                  제안을 제공합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary flex-1"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={createReflectionMutation.isPending}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createReflectionMutation.isPending
                ? 'AI 분석 중...'
                : '회고 저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
