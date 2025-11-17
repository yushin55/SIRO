'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { TrendingUp, Target, Award, Sparkles, ArrowLeft, CheckCircle, LightbulbIcon } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

export default function ReflectionAnalysisPage() {
  const router = useRouter();

  // AI 성장 분석 데이터
  const { data: analysisData } = useQuery({
    queryKey: ['reflection-analysis'],
    queryFn: async () => {
      const response = await fetch('/api/reflections/ai-analysis', {
        headers: { 'x-user-id': localStorage.getItem('x-user-id') || '' },
      });
      return response.json();
    },
  });

  const analysis = analysisData?.data;

  // 차트 데이터 (샘플)
  const progressData = [
    { month: '1월', score: 5.2 },
    { month: '2월', score: 6.1 },
    { month: '3월', score: 6.8 },
    { month: '4월', score: 7.5 },
    { month: '5월', score: 8.2 },
    { month: '6월', score: 8.7 },
  ];

  const keywordData = [
    { keyword: '기획력', level: 8 },
    { keyword: '협업', level: 9 },
    { keyword: '리더십', level: 7 },
    { keyword: '문제해결', level: 8 },
    { keyword: '커뮤니케이션', level: 9 },
  ];

  const moodData = [
    { month: '1월', good: 12, normal: 5, bad: 3 },
    { month: '2월', good: 15, normal: 4, bad: 1 },
    { month: '3월', good: 18, normal: 3, bad: 2 },
    { month: '4월', good: 20, normal: 2, bad: 1 },
  ];

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
            AI 성장 분석
          </h1>
          <p className="text-[#6B6D70]">
            회고 데이터를 분석하여 당신의 성장을 추적합니다
          </p>
        </div>

        {/* AI 종합 분석 */}
        <div className="card mb-6 border-2 border-[#25A778]/20">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-14 h-14 bg-[#25A778] rounded-xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-[#1B1C1E] mb-2">
                AI 종합 분석
              </h2>
              <p className="text-[#6B6D70] leading-relaxed">
                {analysis?.summary ||
                  '최근 6개월간 꾸준한 성장세를 보이고 있습니다. 특히 협업과 커뮤니케이션 역량이 크게 향상되었으며, 프로젝트 완수율도 85%로 매우 높은 수준입니다. 다만, 기술적 스킬 향상을 위한 학습 시간을 늘리면 더욱 균형잡힌 성장을 이룰 수 있을 것입니다.'}
              </p>
            </div>
          </div>

          {/* 핵심 메트릭 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#DDF3EB] p-4 rounded-xl">
              <div className="text-sm text-[#186D50] mb-1">평균 진행도</div>
              <div className="text-2xl font-bold text-[#25A778]">8.2/10</div>
              <div className="text-xs text-[#186D50] mt-1">↑ 15% 증가</div>
            </div>
            <div className="bg-[#E8F1FF] p-4 rounded-xl">
              <div className="text-sm text-[#2563EB] mb-1">회고 작성률</div>
              <div className="text-2xl font-bold text-[#418CC3]">92%</div>
              <div className="text-xs text-[#2563EB] mt-1">↑ 8% 증가</div>
            </div>
            <div className="bg-[#F0E8FF] p-4 rounded-xl">
              <div className="text-sm text-[#7C3AED] mb-1">성장 키워드</div>
              <div className="text-2xl font-bold text-[#9C6BB3]">12개</div>
              <div className="text-xs text-[#7C3AED] mt-1">↑ 3개 추가</div>
            </div>
            <div className="bg-[#FFF3C2] p-4 rounded-xl">
              <div className="text-sm text-[#B45309] mb-1">프로젝트 완수</div>
              <div className="text-2xl font-bold text-[#D77B0F]">85%</div>
              <div className="text-xs text-[#B45309] mt-1">↑ 12% 증가</div>
            </div>
          </div>
        </div>

        {/* 차트 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 진행도 추이 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-[#1B1C1E] mb-4">
              월별 평균 진행도
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAEBEC" />
                <XAxis dataKey="month" stroke="#6B6D70" />
                <YAxis stroke="#6B6D70" domain={[0, 10]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #EAEBEC',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#25A778"
                  strokeWidth={3}
                  dot={{ fill: '#25A778', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 역량 레이더 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-[#1B1C1E] mb-4">
              핵심 역량 분포
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={keywordData}>
                <PolarGrid stroke="#EAEBEC" />
                <PolarAngleAxis dataKey="keyword" stroke="#6B6D70" />
                <PolarRadiusAxis domain={[0, 10]} stroke="#6B6D70" />
                <Radar
                  name="역량"
                  dataKey="level"
                  stroke="#418CC3"
                  fill="#418CC3"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* 기분 추이 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-[#1B1C1E] mb-4">
              월별 기분 분포
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAEBEC" />
                <XAxis dataKey="month" stroke="#6B6D70" />
                <YAxis stroke="#6B6D70" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #EAEBEC',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="good" fill="#25A778" />
                <Bar dataKey="normal" fill="#418CC3" />
                <Bar dataKey="bad" fill="#DC2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 성장 키워드 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-[#1B1C1E] mb-4">
              성장하고 있는 키워드
            </h3>
            <div className="space-y-3">
              {keywordData.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#1B1C1E]">
                      {item.keyword}
                    </span>
                    <span className="text-sm font-bold text-[#25A778]">
                      Lv.{item.level}
                    </span>
                  </div>
                  <div className="h-2 bg-[#F1F2F3] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#25A778] transition-all"
                      style={{ width: `${item.level * 10}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 역량 분석 섹션 */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#418CC3] to-[#2563EB] rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1B1C1E]">역량 분석</h2>
              <p className="text-sm text-[#6B6D70]">
                시스템을 구축하고 관리하는 데 필요한 역량입니다
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* 강점 역량 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-[#1B1C1E]">강점</span>
                <span className="text-xs text-white bg-[#25A778] px-2 py-1 rounded">나</span>
                <span className="text-xs text-[#6B6D70]">참여자 평균</span>
                <span className="text-xs text-[#25A778]">역량 기대 수준</span>
                <span className="text-xs text-[#6B6D70] ml-auto">?</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#1B1C1E]">API 개발</span>
                    <span className="text-sm font-bold text-[#418CC3]">3.8</span>
                  </div>
                  <div className="relative h-3 bg-[#F1F2F3] rounded-full overflow-hidden">
                    <div className="absolute inset-0 flex">
                      {/* 내 점수 */}
                      <div className="h-full bg-[#418CC3]" style={{ width: '76%' }}></div>
                      {/* 참여자 평균 표시 */}
                      <div className="absolute left-[75%] top-0 h-full w-0.5 bg-white"></div>
                      {/* 역량 기대 수준 표시 */}
                      <div className="absolute left-[70%] top-0 h-full w-0.5 bg-[#25A778]"></div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#1B1C1E]">관계형 DB</span>
                    <span className="text-sm font-bold text-[#418CC3]">3.8</span>
                  </div>
                  <div className="relative h-3 bg-[#F1F2F3] rounded-full overflow-hidden">
                    <div className="absolute inset-0 flex">
                      <div className="h-full bg-[#418CC3]" style={{ width: '76%' }}></div>
                      <div className="absolute left-[72%] top-0 h-full w-0.5 bg-white"></div>
                      <div className="absolute left-[68%] top-0 h-full w-0.5 bg-[#25A778]"></div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#1B1C1E]">서버 개발</span>
                    <span className="text-sm font-bold text-[#418CC3]">3.8</span>
                  </div>
                  <div className="relative h-3 bg-[#F1F2F3] rounded-full overflow-hidden">
                    <div className="absolute inset-0 flex">
                      <div className="h-full bg-[#418CC3]" style={{ width: '76%' }}></div>
                      <div className="absolute left-[70%] top-0 h-full w-0.5 bg-white"></div>
                      <div className="absolute left-[65%] top-0 h-full w-0.5 bg-[#25A778]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 보완점 역량 */}
            <div className="pt-4 border-t border-[#EAEBEC]">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-[#DC2626]">보완점</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#1B1C1E]">비관계형 DB</span>
                    <span className="text-sm font-bold text-[#418CC3]">3.8</span>
                  </div>
                  <div className="relative h-3 bg-[#F1F2F3] rounded-full overflow-hidden">
                    <div className="absolute inset-0 flex">
                      <div className="h-full bg-[#418CC3]" style={{ width: '76%' }}></div>
                      <div className="absolute left-[68%] top-0 h-full w-0.5 bg-white"></div>
                      <div className="absolute left-[78%] top-0 h-full w-0.5 bg-[#25A778]"></div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#1B1C1E]">DB 설계</span>
                    <span className="text-sm font-bold text-[#418CC3]">3.8</span>
                  </div>
                  <div className="relative h-3 bg-[#F1F2F3] rounded-full overflow-hidden">
                    <div className="absolute inset-0 flex">
                      <div className="h-full bg-[#418CC3]" style={{ width: '76%' }}></div>
                      <div className="absolute left-[72%] top-0 h-full w-0.5 bg-white"></div>
                      <div className="absolute left-[70%] top-0 h-full w-0.5 bg-[#25A778]"></div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#1B1C1E]">데이터 모델링</span>
                    <span className="text-sm font-bold text-[#418CC3]">2.5</span>
                  </div>
                  <div className="relative h-3 bg-[#F1F2F3] rounded-full overflow-hidden">
                    <div className="absolute inset-0 flex">
                      <div className="h-full bg-[#418CC3]" style={{ width: '50%' }}></div>
                      <div className="absolute left-[55%] top-0 h-full w-0.5 bg-white"></div>
                      <div className="absolute left-[72%] top-0 h-full w-0.5 bg-[#25A778]"></div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#1B1C1E]">결제 시스템 개발</span>
                    <span className="text-sm font-bold text-[#418CC3]">3.8</span>
                  </div>
                  <div className="relative h-3 bg-[#F1F2F3] rounded-full overflow-hidden">
                    <div className="absolute inset-0 flex">
                      <div className="h-full bg-[#418CC3]" style={{ width: '76%' }}></div>
                      <div className="absolute left-[68%] top-0 h-full w-0.5 bg-white"></div>
                      <div className="absolute left-[75%] top-0 h-full w-0.5 bg-[#25A778]"></div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#1B1C1E]">오픈 API 사용</span>
                    <span className="text-sm font-bold text-[#418CC3]">3.8</span>
                  </div>
                  <div className="relative h-3 bg-[#F1F2F3] rounded-full overflow-hidden">
                    <div className="absolute inset-0 flex">
                      <div className="h-full bg-[#418CC3]" style={{ width: '76%' }}></div>
                      <div className="absolute left-[70%] top-0 h-full w-0.5 bg-white"></div>
                      <div className="absolute left-[72%] top-0 h-full w-0.5 bg-[#25A778]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI 방향성 제시 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 강점 */}
          <div className="card border-2 border-[#25A778]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#25A778] rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#1B1C1E]">
                당신의 강점
              </h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-[#25A778] mt-1">•</span>
                <span className="text-sm text-[#1B1C1E]">
                  <strong>협업 능력</strong>이 뛰어나며 팀원들과의 소통이
                  원활합니다
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25A778] mt-1">•</span>
                <span className="text-sm text-[#1B1C1E]">
                  <strong>꾸준한 회고</strong>를 통해 지속적으로 성장하고
                  있습니다
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25A778] mt-1">•</span>
                <span className="text-sm text-[#1B1C1E]">
                  <strong>문제 해결 능력</strong>이 향상되고 있으며 실행력이
                  좋습니다
                </span>
              </li>
            </ul>
          </div>

          {/* 개선 방향 */}
          <div className="card border-2 border-[#418CC3]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#418CC3] rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#1B1C1E]">
                개선 방향
              </h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-[#418CC3] mt-1">•</span>
                <span className="text-sm text-[#1B1C1E]">
                  <strong>기술 스킬</strong> 향상을 위한 학습 시간을 늘려보세요
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#418CC3] mt-1">•</span>
                <span className="text-sm text-[#1B1C1E]">
                  <strong>장기 목표</strong> 설정과 중간 점검을 정기적으로
                  해보세요
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#418CC3] mt-1">•</span>
                <span className="text-sm text-[#1B1C1E]">
                  <strong>멘토링</strong>을 통해 경험을 나누면 더 빠르게
                  성장할 수 있습니다
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* 다음 단계 추천 */}
        <div className="card mt-6 bg-gradient-to-r from-[#DDF3EB] to-[#E8F1FF]">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#25A778]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1B1C1E] mb-2">
                다음 단계 추천
              </h3>
              <p className="text-sm text-[#6B6D70] mb-4">
                AI가 분석한 당신의 성장 경로를 기반으로 다음 단계를 추천합니다
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => router.push('/dashboard/recommendations')}
                  className="px-4 py-2 bg-white text-[#25A778] rounded-lg text-sm font-medium hover:shadow-md transition-all"
                >
                  새로운 활동 탐색
                </button>
                <button
                  onClick={() => router.push('/dashboard/reflections/templates')}
                  className="px-4 py-2 bg-white text-[#418CC3] rounded-lg text-sm font-medium hover:shadow-md transition-all"
                >
                  심화 회고 시작
                </button>
                <button
                  onClick={() => router.push('/dashboard/portfolio')}
                  className="px-4 py-2 bg-white text-[#9C6BB3] rounded-lg text-sm font-medium hover:shadow-md transition-all"
                >
                  포트폴리오 생성
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
