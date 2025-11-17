'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Trophy, Code, Users, Briefcase, Calendar, CalendarDays, CalendarRange, ClipboardList, Sparkles, ArrowLeft } from 'lucide-react';

export default function NewSpacePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: 스페이스 기본 정보
    name: '',
    description: '',
    type: 'contest',
    start_date: '',
    end_date: '',
    
    // Step 2: 회고 추천 (간소화)
    reflection_cycle: 'weekly',
    reminder_enabled: true,
  });

  const projectTypes = [
    { 
      value: 'contest', 
      label: '공모전',
      Icon: Trophy,
      description: '아이디어 경진대회'
    },
    { 
      value: 'project', 
      label: '프로젝트',
      Icon: Code,
      description: '개발/기획 프로젝트'
    },
    { 
      value: 'club', 
      label: '동아리',
      Icon: Users,
      description: '학회/동아리 활동'
    },
    { 
      value: 'internship', 
      label: '인턴십',
      Icon: Briefcase,
      description: '기업 인턴/체험'
    },
  ];

  const cycles = [
    { value: 'daily', label: '매일', Icon: Calendar, desc: '짧은 호흡으로' },
    { value: 'weekly', label: '주 1회', Icon: CalendarDays, desc: '추천', recommended: true },
    { value: 'biweekly', label: '2주 1회', Icon: CalendarRange, desc: '여유있게' },
    { value: 'monthly', label: '월 1회', Icon: ClipboardList, desc: '긴 호흡으로' },
  ];

  const createSpaceMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/spaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': localStorage.getItem('x-user-id') || '',
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          type: data.type,
          start_date: data.start_date,
          end_date: data.end_date,
          reflection_settings: {
            cycle: data.reflection_cycle,
            enabled: data.reminder_enabled,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('스페이스 생성에 실패했습니다');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success('스페이스가 생성되었습니다!');
      router.push(`/dashboard/spaces/${data.data.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name.trim()) {
        toast.error('스페이스 이름을 입력해주세요');
        return;
      }
      if (!formData.start_date) {
        toast.error('시작일을 입력해주세요');
        return;
      }
      setStep(2);
    }
  };

  const handleSubmit = () => {
    createSpaceMutation.mutate(formData);
  };

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
          <h1 className="text-3xl font-bold text-[#1B1C1E] mb-2">
            스페이스 생성
          </h1>
          <p className="text-[#6B6D70]">
            불필요한 과정을 줄여 명확한 플로우를 제공합니다
          </p>
        </div>

        {/* 프로그레스 바 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  step >= 1
                    ? 'bg-[#25A778] text-white'
                    : 'bg-[#F1F2F3] text-[#6B6D70]'
                }`}
              >
                1
              </div>
              <span
                className={`text-sm font-medium ${
                  step >= 1 ? 'text-[#1B1C1E]' : 'text-[#6B6D70]'
                }`}
              >
                스페이스 생성
              </span>
            </div>
            <div className="flex-1 h-1 bg-[#F1F2F3] mx-4">
              <div
                className="h-full bg-[#25A778] transition-all duration-300"
                style={{ width: step >= 2 ? '100%' : '0%' }}
              ></div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  step >= 2
                    ? 'bg-[#25A778] text-white'
                    : 'bg-[#F1F2F3] text-[#6B6D70]'
                }`}
              >
                2
              </div>
              <span
                className={`text-sm font-medium ${
                  step >= 2 ? 'text-[#1B1C1E]' : 'text-[#6B6D70]'
                }`}
              >
                회고 추천
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: 스페이스 생성 */}
        {step === 1 && (
          <div className="space-y-6">
            {/* 스페이스 이름 */}
            <div className="card">
              <label className="block text-sm font-medium text-[#1B1C1E] mb-3">
                스페이스 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="예: 2024 롯데 마케팅 공모전"
                className="input-field w-full text-lg"
                autoFocus
              />
            </div>

            {/* 유형 선택 */}
            <div className="card">
              <label className="block text-sm font-medium text-[#1B1C1E] mb-3">
                유형 선택
              </label>
              <div className="grid grid-cols-2 gap-3">
                {projectTypes.map((type) => {
                  const TypeIcon = type.Icon;
                  return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, type: type.value })
                    }
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.type === type.value
                        ? 'border-[#25A778] bg-[#DDF3EB]'
                        : 'border-[#EAEBEC] bg-white hover:border-[#CACBCC]'
                    }`}
                  >
                    <TypeIcon className="w-8 h-8 mb-2" style={{ color: '#25A778' }} />
                    <div className="font-semibold text-[#1B1C1E] mb-1">
                      {type.label}
                    </div>
                    <div className="text-xs text-[#6B6D70]">
                      {type.description}
                    </div>
                  </button>
                );})}
              </div>
            </div>

            {/* 기간 */}
            <div className="card">
              <label className="block text-sm font-medium text-[#1B1C1E] mb-3">
                활동 기간 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#6B6D70] mb-2">
                    시작일
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#6B6D70] mb-2">
                    종료일 (예상)
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                    className="input-field w-full"
                  />
                </div>
              </div>
            </div>

            {/* 설명 (선택) */}
            <div className="card">
              <label className="block text-sm font-medium text-[#1B1C1E] mb-3">
                간단한 설명 (선택)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="이 활동에 대해 간단히 설명해주세요"
                rows={3}
                className="input-field w-full"
              />
            </div>

            {/* 다음 버튼 */}
            <button onClick={handleNext} className="btn-primary w-full">
              다음: 회고 추천
            </button>
          </div>
        )}

        {/* Step 2: 회고 추천 */}
        {step === 2 && (
          <div className="space-y-6">
            {/* AI 추천 배너 */}
            <div className="card border-2 border-[#25A778]/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#25A778] rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
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
                  <h3 className="font-semibold text-[#1B1C1E] mb-2">
                    맞춤 회고 주기 추천
                  </h3>
                  <p className="text-sm text-[#6B6D70]">
                    <strong className="text-[#1B1C1E]">
                      {formData.type === 'contest' && '공모전'}
                      {formData.type === 'project' && '프로젝트'}
                      {formData.type === 'club' && '동아리'}
                      {formData.type === 'internship' && '인턴십'}
                    </strong>
                    은 <strong className="text-[#25A778]">주 1회</strong> 회고가
                    가장 효과적입니다
                  </p>
                </div>
              </div>
            </div>

            {/* 회고 주기 선택 */}
            <div className="card">
              <label className="block text-sm font-medium text-[#1B1C1E] mb-3">
                회고 주기 선택
              </label>
              <div className="grid grid-cols-2 gap-3">
                {cycles.map((cycle) => {
                  const CycleIcon = cycle.Icon;
                  return (
                  <button
                    key={cycle.value}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        reflection_cycle: cycle.value,
                      })
                    }
                    className={`p-4 rounded-xl border-2 transition-all text-left relative ${
                      formData.reflection_cycle === cycle.value
                        ? 'border-[#25A778] bg-[#DDF3EB]'
                        : 'border-[#EAEBEC] bg-white hover:border-[#CACBCC]'
                    }`}
                  >
                    {cycle.recommended && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#25A778] text-white text-xs rounded-full font-medium">
                        추천
                      </div>
                    )}
                    <CycleIcon className="w-7 h-7 mb-2" style={{ color: '#418CC3' }} />
                    <div className="font-semibold text-[#1B1C1E] mb-1">
                      {cycle.label}
                    </div>
                    <div className="text-xs text-[#6B6D70]">{cycle.desc}</div>
                  </button>
                );})}
              </div>
            </div>

            {/* 알림 설정 */}
            <div className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-[#1B1C1E] mb-1">
                    회고 알림 받기
                  </h3>
                  <p className="text-sm text-[#6B6D70]">
                    설정한 주기에 맞춰 회고 작성 알림을 보내드립니다
                  </p>
                </div>
                <label className="flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={formData.reminder_enabled}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reminder_enabled: e.target.checked,
                      })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${
                      formData.reminder_enabled
                        ? 'bg-[#25A778]'
                        : 'bg-[#CACBCC]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        formData.reminder_enabled
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      } mt-0.5`}
                    ></div>
                  </div>
                </label>
              </div>
            </div>

            {/* 예상 일정 */}
            <div className="card bg-[#F8F9FA]">
              <h3 className="font-medium text-[#1B1C1E] mb-3">예상 일정</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B6D70]">활동 시작</span>
                  <span className="font-medium text-[#1B1C1E]">
                    {formData.start_date
                      ? new Date(formData.start_date).toLocaleDateString()
                      : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B6D70]">첫 회고</span>
                  <span className="font-medium text-[#25A778]">
                    {formData.start_date
                      ? new Date(
                          new Date(formData.start_date).getTime() +
                            (formData.reflection_cycle === 'daily'
                              ? 1
                              : formData.reflection_cycle === 'weekly'
                              ? 7
                              : formData.reflection_cycle === 'biweekly'
                              ? 14
                              : 30) *
                              24 *
                              60 *
                              60 *
                              1000
                        ).toLocaleDateString()
                      : '-'}
                  </span>
                </div>
                {formData.end_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B6D70]">예상 회고 횟수</span>
                    <span className="font-medium text-[#418CC3]">
                      약{' '}
                      {Math.ceil(
                        (new Date(formData.end_date).getTime() -
                          new Date(formData.start_date).getTime()) /
                          (1000 * 60 * 60 * 24) /
                          (formData.reflection_cycle === 'daily'
                            ? 1
                            : formData.reflection_cycle === 'weekly'
                            ? 7
                            : formData.reflection_cycle === 'biweekly'
                            ? 14
                            : 30)
                      )}
                      회
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="btn-secondary flex-1"
              >
                이전
              </button>
              <button
                onClick={handleSubmit}
                disabled={createSpaceMutation.isPending}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {createSpaceMutation.isPending
                  ? '생성 중...'
                  : '스페이스 생성'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
