'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

// 활동 유형
const activityTypes = [
  { id: 'lecture', label: '강의 / 팀플', icon: '📚', color: 'from-blue-400 to-cyan-400' },
  { id: 'club', label: '학회 / 동아리', icon: '👥', color: 'from-purple-400 to-pink-400' },
  { id: 'contest', label: '공모전 / 프로젝트', icon: '🏆', color: 'from-orange-400 to-red-400' },
  { id: 'intern', label: '인턴 / 아르바이트', icon: '💼', color: 'from-green-400 to-emerald-400' },
  { id: 'study', label: '자격증 / 공부', icon: '📖', color: 'from-yellow-400 to-orange-400' },
  { id: 'other', label: '기타', icon: '✨', color: 'from-gray-400 to-gray-500' },
];

// 평소 대비 기분 (Preference Pulse)
const moodCompare = [
  { id: 'worse', label: '평소보다 더 별로였다', emoji: '😞', color: '#DC2626' },
  { id: 'same', label: '평소랑 비슷했다', emoji: '😐', color: '#6B6D70' },
  { id: 'better', label: '평소보다 더 좋았다', emoji: '😊', color: '#25A778' },
];

// 좋았을 때 질문
const positiveReasons = [
  { id: 'communication', label: '사람들과 의견 주고받는 게 재밌었다', icon: '💬' },
  { id: 'creativity', label: '아이디어가 떠오르는 게 짜릿했다', icon: '💡' },
  { id: 'problem_solving', label: '문제가 깔끔하게 해결되는 게 시원했다', icon: '✓' },
  { id: 'helping', label: '누군가에게 도움이 된 느낌이 좋았다', icon: '🤝' },
  { id: 'achievement', label: '결과/성과가 나오는 게 뿌듯했다', icon: '🎯' },
];

// 힘들었을 때 질문
const negativeReasons = [
  { id: 'conflict', label: '사람들 사이 조율/갈등', icon: '⚠️' },
  { id: 'no_idea', label: '아이디어가 안 떠오름', icon: '💭' },
  { id: 'data_work', label: '숫자·자료 처리', icon: '📊' },
  { id: 'time_energy', label: '시간·체력 소모', icon: '⏰' },
  { id: 'no_meaning', label: '내가 왜 이걸 해야 하는지 모르겠는 느낌', icon: '❓' },
];

export default function MicroLogPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<{
    activityType: string;
    memo: string;
    moodCompare: string;
    reason: string;
    suggestedTags: string[];
  }>({
    activityType: '',
    memo: '',
    moodCompare: '',
    reason: '',
    suggestedTags: [],
  });

  // 사용자 기본 기분 체크
  const { data: userData } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await fetch('/api/user/me', {
        headers: {
          'x-user-id': localStorage.getItem('x-user-id') || '',
        },
      });
      return response.json();
    },
  });

  const needsBaselineMood = !userData?.data?.baseline_mood;

  // AI 태그 제안
  const getAISuggestionsMutation = useMutation({
    mutationFn: async (data: { activityType: string; memo: string }) => {
      const response = await fetch('/api/ai/suggest-tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': localStorage.getItem('x-user-id') || '',
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: (data) => {
      setFormData(prev => ({ ...prev, suggestedTags: data?.tags || [] }));
      setStep(3);
    },
    onError: () => {
      // AI 태그 생성 실패해도 다음 단계로 진행
      toast('AI 태그 생성을 건너뜁니다', { icon: 'ℹ️' });
      setFormData(prev => ({ ...prev, suggestedTags: [] }));
      setStep(3);
    },
  });

  // 마이크로 로그 저장
  const saveMicroLogMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/reflections/micro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': localStorage.getItem('x-user-id') || '',
        },
        body: JSON.stringify({
          activity_type: data.activityType,
          memo: data.memo,
          mood_compare: data.moodCompare,
          reason: data.reason,
          tags: data.suggestedTags,
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('저장에 실패했습니다');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('오늘의 활동이 기록되었습니다! 🎉');
      router.push('/dashboard/reflections');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleActivitySelect = (activityId: string) => {
    setFormData({ ...formData, activityType: activityId });
    setStep(2);
  };

  const handleMemoSubmit = () => {
    // AI 태그 제안 요청
    getAISuggestionsMutation.mutate({
      activityType: formData.activityType,
      memo: formData.memo,
    });
  };

  const handleMoodSelect = (mood: string) => {
    setFormData({ ...formData, moodCompare: mood });
    
    if (mood === 'same') {
      // 비슷했다 → 바로 저장
      saveMicroLogMutation.mutate({ ...formData, moodCompare: mood, reason: '' });
    } else {
      // 좋았다/별로였다 → 이유 묻기
      setStep(4);
    }
  };

  const handleReasonSelect = (reasonId: string) => {
    saveMicroLogMutation.mutate({ ...formData, reason: reasonId });
  };

  return (
    <div className="min-h-screen bg-[#F1F2F3]">
      <div className="max-w-3xl mx-auto p-8">
        {/* 헤더 */}
        <div className="mb-8">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : router.back()}
            className="flex items-center gap-2 text-[#6B6D70] hover:text-[#1B1C1E] mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>뒤로</span>
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#25A778] to-[#2DC98E] rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1B1C1E]">초라이트 기록</h1>
              <p className="text-sm text-[#6B6D70]">부담 없이 빠르게 기록하세요</p>
            </div>
          </div>

          {/* 진행 표시 */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all ${
                  s <= step ? 'bg-[#25A778]' : 'bg-[#EAEBEC]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: 활동 선택 */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#1B1C1E] mb-2">
                오늘 기억해두고 싶은 활동을 골라주세요
              </h2>
              <p className="text-sm text-[#6B6D70]">여러 개 해당되면 가장 기억에 남는 것 하나만!</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {activityTypes.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => handleActivitySelect(activity.id)}
                  className={`group p-6 rounded-2xl border-2 transition-all hover:scale-105 bg-gradient-to-br ${activity.color}`}
                >
                  <div className="text-center">
                    <div className="text-5xl mb-3">{activity.icon}</div>
                    <div className="font-bold text-white text-lg drop-shadow-md">
                      {activity.label}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: 메모 (선택) */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#1B1C1E] mb-2">
                한 줄로만 남겨두고 싶다면 적어주세요
              </h2>
              <p className="text-sm text-[#6B6D70]">안 적어도 괜찮아요. AI가 자동으로 태그를 추천해드립니다.</p>
            </div>

            <textarea
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              placeholder="예: 오늘 팀플 발표 준비했는데 생각보다 잘 됐다"
              rows={4}
              className="w-full px-4 py-3 bg-white border-2 border-[#EAEBEC] rounded-xl focus:outline-none focus:border-[#25A778] text-sm"
            />

            <div className="flex gap-3">
              <button
                onClick={() => handleMemoSubmit()}
                disabled={getAISuggestionsMutation.isPending}
                className="btn-primary flex-1"
              >
                {getAISuggestionsMutation.isPending ? 'AI 분석 중...' : '다음'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 기분 비교 */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#1B1C1E] mb-2">
                오늘 이 활동은, 평소 기분에 비해 어땠나요?
              </h2>
              <p className="text-sm text-[#6B6D70]">평소 내 기본 기분과 비교해서 말해주세요</p>
            </div>

            {/* AI가 제안한 태그 표시 */}
            {formData.suggestedTags && formData.suggestedTags.length > 0 && (
              <div className="bg-[#DDF3EB] rounded-xl p-4 border border-[#25A778]/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#25A778] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-[#186D50] mb-2">
                      AI가 분석한 활동 유형
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.suggestedTags.map((tag, index) => (
                        <span key={`${tag}-${index}`} className="px-3 py-1 bg-white/50 rounded-lg text-sm text-[#186D50]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {moodCompare.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => handleMoodSelect(mood.id)}
                  className="w-full p-4 rounded-xl border-2 border-[#EAEBEC] bg-white hover:border-[#25A778] hover:bg-[#DDF3EB] transition-all flex items-center gap-4"
                >
                  <div className="text-4xl">{mood.emoji}</div>
                  <div className="flex-1 text-left font-medium text-[#1B1C1E]">
                    {mood.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: 이유 (좋았을 때 / 힘들었을 때) */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#1B1C1E] mb-2">
                {formData.moodCompare === 'better' 
                  ? '어떤 느낌이 가장 컸나요?' 
                  : '뭐가 제일 힘들었나요?'}
              </h2>
              <p className="text-sm text-[#6B6D70]">하나만 골라볼게요</p>
            </div>

            <div className="space-y-3">
              {(formData.moodCompare === 'better' ? positiveReasons : negativeReasons).map((reason) => (
                <button
                  key={reason.id}
                  onClick={() => handleReasonSelect(reason.id)}
                  disabled={saveMicroLogMutation.isPending}
                  className="w-full p-4 rounded-xl border-2 border-[#EAEBEC] bg-white hover:border-[#25A778] hover:bg-[#DDF3EB] transition-all flex items-center gap-4 disabled:opacity-50"
                >
                  <div className="text-3xl">{reason.icon}</div>
                  <div className="flex-1 text-left font-medium text-[#1B1C1E]">
                    {reason.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
