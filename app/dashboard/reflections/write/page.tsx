'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Smile, Frown, Meh, SmilePlus, Annoyed, ArrowLeft, ChevronDown, Check, Sparkles } from 'lucide-react';

const moods = [
  { value: 'great', label: '매우 좋음', Icon: SmilePlus, color: '#25A778' },
  { value: 'good', label: '좋음', Icon: Smile, color: '#2DC98E' },
  { value: 'normal', label: '보통', Icon: Meh, color: '#6B6D70' },
  { value: 'bad', label: '안좋음', Icon: Frown, color: '#D77B0F' },
  { value: 'terrible', label: '매우 안좋음', Icon: Annoyed, color: '#DC2626' },
];

export default function WriteReflectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');
  const spaceId = searchParams.get('space_id');

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [requestAIAnalysis, setRequestAIAnalysis] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    space_id: spaceId || '',
    template_id: templateId || '',
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
    '계속 유지하고 싶은 것은? (Keep)',
    '문제라고 생각하는 것은? (Problem)',
    '다음에 시도해볼 것은? (Try)',
  ];

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const createReflectionMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/reflections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': localStorage.getItem('x-user-id') || '',
        },
        body: JSON.stringify({
          space_id: data.space_id,
          template_id: data.template_id,
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

    const unansweredQuestions = questions.filter(
      (q: string) => !formData.answers.find((a) => a.question === q)?.answer
    );

    if (unansweredQuestions.length > 0) {
      toast.error('모든 질문에 답변해주세요');
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

  const handleSelectQuestion = (index: number) => {
    setSelectedQuestionIndex(index);
    setIsDropdownOpen(false);
    // 해당 질문 입력란으로 스크롤
    const element = document.getElementById(`question-${index}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const progress = Math.round(
    (formData.answers.filter((a) => a.answer.trim()).length / questions.length) *
      100
  );

  return (
    <div className="min-h-screen bg-[#F1F2F3]">
      <div className="max-w-4xl mx-auto p-8">
        {/* 헤더 with 드롭다운 */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#6B6D70] hover:text-[#1B1C1E] mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            돌아가기
          </button>

          {/* 드롭다운 네비게이션 */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-white rounded-xl p-4 shadow-sm border border-[#EAEBEC] flex items-center justify-between hover:border-[#25A778] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#DDF3EB] rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-[#25A778]">
                    {selectedQuestionIndex + 1}
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-sm text-[#6B6D70] mb-0.5">
                    질문 {selectedQuestionIndex + 1}/{questions.length}
                  </div>
                  <div className="font-medium text-[#1B1C1E]">
                    {questions[selectedQuestionIndex]}
                  </div>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-[#6B6D70] transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* 드롭다운 메뉴 */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#EAEBEC] overflow-hidden z-50 max-h-80 overflow-y-auto">
                {questions.map((question: string, index: number) => {
                  const isAnswered = getAnswerValue(question).trim().length > 0;
                  const isSelected = selectedQuestionIndex === index;

                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectQuestion(index)}
                      className={`w-full p-4 text-left flex items-center gap-3 transition-colors ${
                        isSelected
                          ? 'bg-[#DDF3EB]'
                          : 'hover:bg-[#F1F2F3]'
                      } ${
                        index !== questions.length - 1
                          ? 'border-b border-[#EAEBEC]'
                          : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isAnswered
                            ? 'bg-[#25A778]'
                            : isSelected
                            ? 'bg-[#25A778]'
                            : 'bg-[#F1F2F3]'
                        }`}
                      >
                        {isAnswered ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : (
                          <span
                            className={`text-sm font-bold ${
                              isSelected ? 'text-white' : 'text-[#6B6D70]'
                            }`}
                          >
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <span
                        className={`flex-1 text-sm ${
                          isSelected
                            ? 'text-[#186D50] font-medium'
                            : 'text-[#1B1C1E]'
                        }`}
                      >
                        {question}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 진행률 */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-[#6B6D70]">진행률</span>
              <span className="font-medium text-[#25A778]">{progress}%</span>
            </div>
            <div className="h-2 bg-[#F1F2F3] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#25A778] transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 기분 & 진행도 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* 기분 */}
            <div className="card">
              <h2 className="text-lg font-semibold text-[#1B1C1E] mb-4">
                오늘의 기분
              </h2>
              <div className="grid grid-cols-5 gap-2">
              {moods.map((mood) => {
                const Icon = mood.Icon;
                return (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, mood: mood.value })}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    formData.mood === mood.value
                      ? 'border-[#25A778] bg-[#DDF3EB] scale-105'
                      : 'border-[#EAEBEC] bg-white hover:border-[#CACBCC]'
                  }`}
                >
                    <Icon className="w-7 h-7" style={{ color: mood.color }} />
                    <span
                      className={`text-xs ${
                        formData.mood === mood.value
                          ? 'text-[#186D50] font-medium'
                          : 'text-[#6B6D70]'
                      }`}
                    >
                      {mood.label}
                    </span>
                  </button>
                );
              })}
              </div>
            </div>

            {/* 진행도 */}
            <div className="card">
              <h2 className="text-lg font-semibold text-[#1B1C1E] mb-4">
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
                <div className="flex-shrink-0 w-14 h-14 bg-[#DDF3EB] rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold text-[#25A778]">
                    {formData.progress_score}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 회고 질문들 */}
          <div className="space-y-4">
            {questions.map((question: string, index: number) => (
              <div
                key={index}
                id={`question-${index}`}
                className={`card transition-all ${
                  selectedQuestionIndex === index
                    ? 'ring-2 ring-[#25A778] shadow-lg'
                    : ''
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                      getAnswerValue(question).trim()
                        ? 'bg-[#25A778]'
                        : 'bg-[#F1F2F3]'
                    }`}
                  >
                    {getAnswerValue(question).trim() ? (
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span className="text-sm font-bold text-[#6B6D70]">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[#1B1C1E] mb-3">
                      {question}
                    </h3>
                    <textarea
                      value={getAnswerValue(question)}
                      onChange={(e) =>
                        handleAnswerChange(question, e.target.value)
                      }
                      onFocus={() => setSelectedQuestionIndex(index)}
                      placeholder="답변을 입력하세요..."
                      rows={4}
                      className="input-field w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI 분석 안내 */}
          <div className="card bg-[#DDF3EB] border-2 border-[#25A778]/20 mt-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-[#25A778] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#1B1C1E] mb-1">
                  AI 분석 요청
                </h3>
                <p className="text-sm text-[#6B6D70]">
                  회고 작성 후 AI가 성장 포인트를 분석해드려요
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ai-analysis"
                  checked={requestAIAnalysis}
                  onChange={(e) => setRequestAIAnalysis(e.target.checked)}
                  className="w-5 h-5 text-[#25A778] rounded"
                />
                <label
                  htmlFor="ai-analysis"
                  className="text-sm font-medium text-[#1B1C1E] cursor-pointer"
                >
                  요청
                </label>
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              취소
            </button>
            <button type="submit" className="btn-primary flex-1">
              회고 저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
