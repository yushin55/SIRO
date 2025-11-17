'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Search, Target, Smile, HelpCircle, Calendar, ArrowLeft, Users, CheckCircle, Sparkles } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  Icon: any;
  color: string;
  questions: string[];
  recommendedFor: string[];
  usageCount: number;
}

const templates: Template[] = [
  {
    id: 'kpt',
    name: 'KPT 회고',
    description: 'Keep, Problem, Try 방식으로 간단하고 효과적인 회고',
    category: '기본',
    Icon: FileText,
    color: '#25A778',
    questions: [
      '계속 유지하고 싶은 것은? (Keep)',
      '문제라고 생각하는 것은? (Problem)',
      '다음에 시도해볼 것은? (Try)',
    ],
    recommendedFor: ['팀 회고', '스프린트 회고', '프로젝트 회고'],
    usageCount: 1245,
  },
  {
    id: '4f',
    name: '4F 회고',
    description: 'Fact, Feeling, Finding, Future로 깊이있는 성찰',
    category: '심화',
    Icon: Search,
    color: '#418CC3',
    questions: [
      '어떤 일이 있었나요? (Fact)',
      '어떤 감정을 느꼈나요? (Feeling)',
      '무엇을 배웠나요? (Finding)',
      '앞으로 무엇을 할까요? (Future)',
    ],
    recommendedFor: ['개인 회고', '학습 회고', '경험 정리'],
    usageCount: 892,
  },
  {
    id: 'start-stop-continue',
    name: 'Start-Stop-Continue',
    description: '시작, 중단, 계속할 것을 명확하게 구분',
    category: '기본',
    Icon: Target,
    color: '#9C6BB3',
    questions: [
      '새롭게 시작할 것은? (Start)',
      '중단할 것은? (Stop)',
      '계속 유지할 것은? (Continue)',
    ],
    recommendedFor: ['습관 개선', '업무 프로세스', '팀 문화'],
    usageCount: 756,
  },
  {
    id: 'mad-sad-glad',
    name: 'Mad-Sad-Glad',
    description: '감정 기반으로 경험을 돌아보는 회고',
    category: '감정',
    Icon: Smile,
    color: '#D77B0F',
    questions: [
      '화가 났던 일은? (Mad)',
      '슬펐던 일은? (Sad)',
      '기뻤던 일은? (Glad)',
      '다음에는 어떻게 할까요?',
    ],
    recommendedFor: ['감정 표현', '팀 소통', '갈등 해소'],
    usageCount: 634,
  },
  {
    id: '5why',
    name: '5 Why 회고',
    description: '근본 원인을 파악하는 심층 분석 회고',
    category: '분석',
    Icon: HelpCircle,
    color: '#DC2626',
    questions: [
      '무슨 일이 있었나요?',
      '왜 그런 일이 발생했나요? (1차)',
      '그 이유는 무엇인가요? (2차)',
      '더 깊은 원인은? (3차)',
      '근본 원인은? (4차)',
      '해결 방안은? (5차)',
    ],
    recommendedFor: ['문제 해결', '원인 분석', '개선 방안'],
    usageCount: 421,
  },
  {
    id: 'weekly-review',
    name: '주간 리뷰',
    description: '한 주를 정리하고 다음 주를 계획하는 회고',
    category: '정기',
    Icon: Calendar,
    color: '#25A778',
    questions: [
      '이번 주 주요 성과는?',
      '이번 주 어려웠던 점은?',
      '이번 주 배운 점은?',
      '다음 주 목표는?',
      '다음 주 개선할 점은?',
    ],
    recommendedFor: ['주간 회고', '정기 리뷰', '목표 관리'],
    usageCount: 1089,
  },
];

export default function ReflectionTemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );

  const categories = ['전체', '기본', '심화', '감정', '분석', '정기'];

  const filteredTemplates =
    selectedCategory === '전체'
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleStartReflection = () => {
    if (!selectedTemplate) return;
    router.push(
      `/dashboard/reflections/write?template=${selectedTemplate.id}`
    );
  };

  return (
    <div className="min-h-screen bg-[#F1F2F3]">
      <div className="max-w-7xl mx-auto p-8">
        {/* 헤더 */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#6B6D70] hover:text-[#1B1C1E] mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            돌아가기
          </button>
          <h1 className="text-3xl font-bold text-[#1B1C1E] mb-2">
            회고 템플릿 추천
          </h1>
          <p className="text-[#6B6D70]">
            상황에 맞는 회고 템플릿을 선택하고 AI 추천을 받아보세요
          </p>
        </div>

        {/* AI 추천 배너 */}
        <div className="card mb-6 border-2 border-[#25A778]/20">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-[#25A778] rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1B1C1E] mb-2">
                AI가 추천하는 템플릿
              </h3>
              <p className="text-sm text-[#6B6D70] mb-3">
                최근 활동 분석 결과, <strong>KPT 회고</strong>와{' '}
                <strong>주간 리뷰</strong>가 당신의 성장에 도움이 될 것
                같아요!
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSelectTemplate(templates[0])}
                  className="px-3 py-1.5 bg-[#DDF3EB] text-[#186D50] rounded-lg text-sm font-medium hover:bg-[#25A778] hover:text-white transition-colors"
                >
                  KPT 회고 시작
                </button>
                <button
                  onClick={() => handleSelectTemplate(templates[5])}
                  className="px-3 py-1.5 bg-[#DDF3EB] text-[#186D50] rounded-lg text-sm font-medium hover:bg-[#25A778] hover:text-white transition-colors"
                >
                  주간 리뷰 시작
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-[#25A778] text-white shadow-md'
                  : 'bg-white text-[#6B6D70] hover:bg-[#F1F2F3]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 템플릿 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
              className={`card cursor-pointer transition-all ${
                selectedTemplate?.id === template.id
                  ? 'ring-2 ring-[#25A778] shadow-lg'
                  : 'hover:shadow-lg'
              }`}
            >
              {/* 헤더 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${template.color}20` }}
                  >
                    {(() => {
                      const TemplateIcon = template.Icon;
                      return <TemplateIcon className="w-6 h-6" style={{ color: template.color }} />;
                    })()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1B1C1E]">
                      {template.name}
                    </h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${template.color}20`,
                        color: template.color,
                      }}
                    >
                      {template.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* 설명 */}
              <p className="text-sm text-[#6B6D70] mb-4">
                {template.description}
              </p>

              {/* 질문 미리보기 */}
              <div className="mb-4">
                <div className="text-xs font-medium text-[#6B6D70] mb-2">
                  주요 질문 ({template.questions.length}개)
                </div>
                <ul className="space-y-1.5">
                  {template.questions.slice(0, 3).map((question, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-[#1B1C1E] flex items-start gap-2"
                    >
                      <span className="text-[#25A778] mt-0.5">•</span>
                      <span className="line-clamp-1">{question}</span>
                    </li>
                  ))}
                  {template.questions.length > 3 && (
                    <li className="text-xs text-[#6B6D70] pl-3">
                      +{template.questions.length - 3}개 더보기
                    </li>
                  )}
                </ul>
              </div>

              {/* 추천 상황 */}
              <div className="mb-4">
                <div className="text-xs font-medium text-[#6B6D70] mb-2">
                  추천 상황
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {template.recommendedFor.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-[#F1F2F3] text-[#6B6D70] rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 사용 횟수 */}
              <div className="flex items-center justify-between pt-4 border-t border-[#EAEBEC]">
                <div className="flex items-center gap-1.5 text-xs text-[#6B6D70]">
                  <Users className="w-4 h-4" />
                  {template.usageCount.toLocaleString()}명 사용중
                </div>
                {selectedTemplate?.id === template.id && (
                  <span className="text-xs font-medium text-[#25A778]">
                    선택됨 ✓
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 선택된 템플릿 액션 */}
        {selectedTemplate && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 flex items-center gap-6 border border-[#EAEBEC]">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${selectedTemplate.color}20`,
                  }}
                >
                  {(() => {
                    const SelectedIcon = selectedTemplate.Icon;
                    return <SelectedIcon className="w-6 h-6" style={{ color: selectedTemplate.color }} />;
                  })()}
                </div>
                <div>
                  <div className="font-semibold text-[#1B1C1E]">
                    {selectedTemplate.name}
                  </div>
                  <div className="text-sm text-[#6B6D70]">
                    {selectedTemplate.questions.length}개 질문
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="btn-secondary"
                >
                  취소
                </button>
                <button onClick={handleStartReflection} className="btn-primary">
                  이 템플릿으로 시작
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
