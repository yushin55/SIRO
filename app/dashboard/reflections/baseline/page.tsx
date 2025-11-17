'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Sparkles } from 'lucide-react';

const baselineMoods = [
  { id: 'tired', label: '대체로 힘들고 지친 편', emoji: '😞', color: '#DC2626', description: '평소에 피곤하고 에너지가 낮은 편이에요' },
  { id: 'neutral', label: '그냥 쏘쏘', emoji: '😐', color: '#6B6D70', description: '특별히 좋지도 나쁘지도 않아요' },
  { id: 'positive', label: '나름 즐겁게 지내는 편', emoji: '😊', color: '#25A778', description: '대체로 긍정적이고 활기찬 편이에요' },
];

export default function BaselineMoodPage() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState('');

  const saveBaselineMutation = useMutation({
    mutationFn: async (mood: string) => {
      // 일단 localStorage에 저장 (백엔드 준비되면 API 호출)
      localStorage.setItem('baseline_mood', mood);
      
      // 백엔드 API 호출 시도 (실패해도 계속 진행)
      try {
        const response = await fetch('http://localhost:8000/api/user/baseline-mood', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'x-user-id': localStorage.getItem('x-user-id') || '',
          },
          body: JSON.stringify({ baseline_mood: mood }),
        });
        
        if (response.ok) {
          return response.json();
        }
      } catch (error) {
        console.log('Backend not ready, using localStorage');
      }
      
      return { success: true };
    },
    onSuccess: () => {
      toast.success('기본 기분이 설정되었습니다!');
      setTimeout(() => {
        router.push('/dashboard/reflections/micro');
      }, 500);
    },
    onError: () => {
      toast.error('저장에 실패했습니다');
    },
  });

  const handleSubmit = () => {
    if (!selectedMood) {
      toast.error('기분을 선택해주세요');
      return;
    }
    saveBaselineMutation.mutate(selectedMood);
  };

  return (
    <div className="min-h-screen bg-[#F1F2F3] flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#25A778] to-[#2DC98E] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#1B1C1E] mb-3">
            시작하기 전에, 님을 조금 알려주세요
          </h1>
          <p className="text-[#6B6D70] leading-relaxed">
            ProoF가 님의 기본 기분을 알면,<br />
            나중에 좋아하는/힘든 일을 더 정확히 추천해줄 수 있어요.
          </p>
        </div>

        <div className="card mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#1B1C1E] mb-2">
              평소 하루가 아무 일도 없을 때,<br />
              님의 기분은 어떤 편인가요?
            </h2>
            <p className="text-sm text-[#6B6D70]">
              정답은 없어요. 솔직하게 말씀해주세요!
            </p>
          </div>

          <div className="space-y-3">
            {baselineMoods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`w-full p-6 rounded-2xl border-2 transition-all ${
                  selectedMood === mood.id
                    ? 'border-[#25A778] bg-[#DDF3EB] scale-105'
                    : 'border-[#EAEBEC] bg-white hover:border-[#CACBCC]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{mood.emoji}</div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-lg text-[#1B1C1E] mb-1">
                      {mood.label}
                    </div>
                    <div className="text-sm text-[#6B6D70]">
                      {mood.description}
                    </div>
                  </div>
                  {selectedMood === mood.id && (
                    <div className="flex-shrink-0 w-6 h-6 bg-[#25A778] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedMood || saveBaselineMutation.isPending}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saveBaselineMutation.isPending ? '저장 중...' : '시작하기'}
        </button>

        <div className="mt-6 text-center">
          <p className="text-xs text-[#6B6D70]">
            이 설정은 나중에 프로필에서 언제든 변경할 수 있어요
          </p>
        </div>
      </div>
    </div>
  );
}
