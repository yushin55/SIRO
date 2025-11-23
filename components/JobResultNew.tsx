'use client';

import { useState, useEffect } from 'react';
import { X, TrendingUp, Building2, GraduationCap, Briefcase, ChevronRight, ArrowUpRight, BarChart3, Award, Target, Zap, Users, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface JobResultProps {
  topJob: string;
  topJobName: string;
  scores: {
    MKT: number;
    PM: number;
    DATA: number;
    DEV: number;
    DESIGN: number;
    PEOPLE: number;
  };
  onClose: () => void;
}

interface JobDetail {
  rank: number;
  code: string;
  name: string;
  score: number;
  percentage: number;
  description: string;
  responsibilities: string[];
  skills: string[];
  companies: string[];
  salary: string;
  growth: string;
  demand: string;
}

// 직무별 상세 정보 데이터베이스
const JOB_DETAILS: {[key: string]: Omit<JobDetail, 'rank' | 'score' | 'percentage'>} = {
  MKT: {
    code: 'MKT',
    name: '마케팅/그로스',
    description: '사용자 확보와 성장을 이끄는 전략가',
    responsibilities: [
      '시장 조사 및 타겟 고객 분석',
      '마케팅 캠페인 기획 및 실행',
      'SNS, 콘텐츠 마케팅 전략 수립',
      '데이터 기반 성과 측정 및 개선',
      '브랜드 포지셔닝 및 메시지 개발'
    ],
    skills: [
      'Google Analytics',
      'Meta 광고 관리자',
      'SQL 기초',
      'Excel/Spreadsheet',
      'Notion, Figma',
      'A/B 테스트',
      '콘텐츠 기획',
      'SEO/SEM'
    ],
    companies: [
      '카카오',
      '네이버',
      '쿠팡',
      '당근마켓',
      '토스',
      '배달의민족',
      '야놀자',
      '무신사',
      '29CM',
      '왓챠'
    ],
    salary: '신입 3,500만원 ~ 4,500만원',
    growth: '+15.3%',
    demand: '높음'
  },
  PM: {
    code: 'PM',
    name: '기획/PM',
    description: '서비스의 방향을 설계하는 전략가',
    responsibilities: [
      '서비스 기획 문서(PRD) 작성',
      '사용자 니즈 분석 및 요구사항 정의',
      '개발팀과 협업하여 기능 구현',
      '로드맵 수립 및 우선순위 관리',
      '데이터 기반 의사결정 및 개선'
    ],
    skills: [
      'PRD 작성',
      'SQL',
      'Figma',
      'Jira/Confluence',
      'Google Analytics',
      '데이터 분석',
      'A/B 테스트',
      '와이어프레임'
    ],
    companies: [
      '카카오',
      '네이버',
      '라인',
      '쿠팡',
      '당근마켓',
      '토스',
      '배민',
      '뱅크샐러드',
      '직방',
      '하이퍼커넥트'
    ],
    salary: '신입 4,000만원 ~ 5,000만원',
    growth: '+18.7%',
    demand: '매우 높음'
  },
  DATA: {
    code: 'DATA',
    name: '데이터 분석',
    description: '데이터로 인사이트를 발굴하는 분석가',
    responsibilities: [
      '비즈니스 데이터 분석 및 인사이트 도출',
      '대시보드 및 리포트 작성',
      'A/B 테스트 설계 및 분석',
      '예측 모델링 및 통계 분석',
      '데이터 파이프라인 구축 지원'
    ],
    skills: [
      'SQL',
      'Python (Pandas, NumPy)',
      'R',
      'Tableau/PowerBI',
      'Excel (고급)',
      '통계학',
      'Google Analytics',
      '머신러닝 기초'
    ],
    companies: [
      '카카오',
      '네이버',
      '쿠팡',
      '토스',
      'SK텔레콤',
      '우아한형제들',
      '넷마블',
      'KB금융',
      '신한은행',
      'LG CNS'
    ],
    salary: '신입 4,200만원 ~ 5,500만원',
    growth: '+22.4%',
    demand: '매우 높음'
  },
  DEV: {
    code: 'DEV',
    name: '개발/엔지니어',
    description: '기술로 서비스를 구현하는 개발자',
    responsibilities: [
      '웹/앱 서비스 개발 및 유지보수',
      'API 설계 및 데이터베이스 구축',
      '코드 리뷰 및 테스트 작성',
      '성능 최적화 및 버그 수정',
      '기술 스택 선정 및 아키텍처 설계'
    ],
    skills: [
      'JavaScript/TypeScript',
      'React/Vue/Next.js',
      'Node.js/Express',
      'Python/Django',
      'Git/GitHub',
      'SQL/NoSQL',
      'AWS/Docker',
      '알고리즘'
    ],
    companies: [
      '카카오',
      '네이버',
      '라인',
      '쿠팡',
      '토스',
      '배민',
      '당근마켓',
      'NHN',
      '넷마블',
      '컬리'
    ],
    salary: '신입 4,500만원 ~ 6,000만원',
    growth: '+20.1%',
    demand: '매우 높음'
  },
  DESIGN: {
    code: 'DESIGN',
    name: 'UX/UI 디자인',
    description: '사용자 경험을 디자인하는 창작자',
    responsibilities: [
      'UI/UX 디자인 및 프로토타입 제작',
      '사용자 리서치 및 테스트 진행',
      '디자인 시스템 구축 및 관리',
      '개발팀과 협업하여 구현',
      '와이어프레임 및 사용자 플로우 설계'
    ],
    skills: [
      'Figma',
      'Adobe XD',
      'Sketch',
      'Photoshop/Illustrator',
      '프로토타이핑',
      '사용자 리서치',
      '디자인 시스템',
      'HTML/CSS 기초'
    ],
    companies: [
      '카카오',
      '네이버',
      '라인',
      '쿠팡',
      '토스',
      '당근마켓',
      '뱅크샐러드',
      '무신사',
      '29CM',
      '직방'
    ],
    salary: '신입 3,800만원 ~ 5,000만원',
    growth: '+16.8%',
    demand: '높음'
  },
  PEOPLE: {
    code: 'PEOPLE',
    name: 'HR/인사',
    description: '조직문화를 만드는 People Partner',
    responsibilities: [
      '채용 프로세스 설계 및 운영',
      '조직문화 기획 및 실행',
      '교육 프로그램 개발 및 운영',
      '인사 제도 및 평가 관리',
      '구성원 경험(EX) 개선'
    ],
    skills: [
      '채용 전략',
      '인터뷰 스킬',
      'People Analytics',
      'Excel',
      'HRIS 시스템',
      '노무 기초',
      '커뮤니케이션',
      '프로젝트 관리'
    ],
    companies: [
      '카카오',
      '네이버',
      '쿠팡',
      '토스',
      '배민',
      '당근마켓',
      'SK',
      'LG',
      '삼성',
      '현대'
    ],
    salary: '신입 3,500만원 ~ 4,500만원',
    growth: '+12.5%',
    demand: '보통'
  },
  HR: {
    code: 'HR',
    name: 'HR/인사',
    description: '조직문화를 만드는 People Partner',
    responsibilities: [
      '채용 프로세스 설계 및 운영',
      '조직문화 기획 및 실행',
      '교육 프로그램 개발 및 운영',
      '인사 제도 및 평가 관리',
      '구성원 경험(EX) 개선'
    ],
    skills: [
      '채용 전략',
      '인터뷰 스킬',
      'People Analytics',
      'Excel',
      'HRIS 시스템',
      '노무 기초',
      '커뮤니케이션',
      '프로젝트 관리'
    ],
    companies: [
      '카카오',
      '네이버',
      '쿠팡',
      '토스',
      '배민',
      '당근마켓',
      'SK',
      'LG',
      '삼성',
      '현대'
    ],
    salary: '신입 3,500만원 ~ 4,500만원',
    growth: '+12.5%',
    demand: '보통'
  },
  FIN: {
    code: 'FIN',
    name: '재무/회계',
    description: '숫자로 경영을 지원하는 전문가',
    responsibilities: [
      '재무제표 작성 및 분석',
      '예산 수립 및 관리',
      '투자 분석 및 IR 지원',
      '세무 관리 및 신고',
      '경영 의사결정 지원'
    ],
    skills: [
      'Excel (고급)',
      '회계 원리',
      'ERP 시스템',
      '재무제표 분석',
      '세무 기초',
      'IFRS',
      'PowerPoint',
      'SQL'
    ],
    companies: [
      '삼성',
      'LG',
      'SK',
      '현대',
      'KB금융',
      '신한금융',
      '카카오',
      '네이버',
      '쿠팡',
      'KPMG'
    ],
    salary: '신입 3,800만원 ~ 5,000만원',
    growth: '+10.2%',
    demand: '보통'
  }
};

export default function JobResultModal({ topJob, topJobName, scores, onClose }: JobResultProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'path'>('overview');
  
  // scores가 undefined인 경우 기본값 설정
  const safeScores = scores || {
    MKT: 0,
    PM: 0,
    DATA: 0,
    DEV: 0,
    DESIGN: 0,
    PEOPLE: 0
  };

  // 점수 기반으로 상위 3개 직무 추출
  const getTopJobs = (): JobDetail[] => {
    const jobScores = Object.entries(safeScores).map(([jobCode, score]) => ({
      ...JOB_DETAILS[jobCode] || JOB_DETAILS['PM'],
      score
    }));

    // 점수로 정렬
    jobScores.sort((a, b) => b.score - a.score);

    // 상위 3개에 rank와 percentage 추가
    const maxScore = jobScores[0].score;
    return jobScores.slice(0, 3).map((job, index) => ({
      ...job,
      rank: index + 1,
      percentage: maxScore > 0 ? Math.round((job.score / maxScore) * 100) : 0
    }));
  };

  const topJobs = getTopJobs();
  const top1Job = topJobs[0];

  // 차트 데이터
  const barChartData = Object.entries(safeScores).map(([key, value]) => {
    const names: {[k: string]: string} = {
      MKT: '마케팅', PM: '기획', DATA: '데이터', 
      DEV: '개발', DESIGN: '디자인', PEOPLE: 'HR'
    };
    return {
      name: names[key] || key,
      score: value,
      fill: key === topJob ? '#6366F1' : '#E5E7EB'
    };
  });

  // 도넛 차트 데이터 (상위 3개)
  const pieChartData = topJobs.map((job, index) => ({
    name: job.name,
    value: job.score,
    fill: index === 0 ? '#6366F1' : index === 1 ? '#8B5CF6' : '#A78BFA'
  }));

  // 통계 카드 색상
  const getGrowthColor = (growth: string) => {
    const value = parseFloat(growth);
    if (value >= 20) return 'text-green-600';
    if (value >= 15) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[#F5F6FA] rounded-3xl w-full max-w-7xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">직무 적합도 분석</h2>
              <p className="text-sm text-gray-500 mt-1">Career Analytics Report</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white border-b border-gray-200 px-8">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-4 font-semibold text-sm transition-all relative ${
                activeTab === 'overview'
                  ? 'text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
              {activeTab === 'overview' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-4 font-semibold text-sm transition-all relative ${
                activeTab === 'jobs'
                  ? 'text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Top 3 Jobs
              {activeTab === 'jobs' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('path')}
              className={`px-4 py-4 font-semibold text-sm transition-all relative ${
                activeTab === 'path'
                  ? 'text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Career Path
              {activeTab === 'path' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 상단 통계 카드 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* 1순위 직무 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-500">Top Match</span>
                    <Award className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{top1Job.name}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-indigo-600">
                      {top1Job.percentage}% 적합
                    </span>
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                  </div>
                </div>

                {/* 총 점수 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-500">Total Score</span>
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {Object.values(safeScores).reduce((a, b) => a + b, 0)}
                  </div>
                  <div className="text-sm text-gray-500">점</div>
                </div>

                {/* 평균 성장률 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-500">Avg Growth</span>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {top1Job.growth}
                  </div>
                  <div className="text-sm text-green-600 font-medium">전년 대비</div>
                </div>

                {/* 수요 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-500">Demand</span>
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {top1Job.demand}
                  </div>
                  <div className="text-sm text-gray-500">채용 수요</div>
                </div>
              </div>

              {/* 차트 섹션 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 직무별 점수 바차트 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Job Score Analysis</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: '#FFF',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                        {barChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* 상위 3개 직무 도넛 차트 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Top 3 Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: '#FFF',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {pieChartData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.fill }} />
                          <span className="text-sm text-gray-700">{item.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{item.value}점</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 1순위 직무 상세 */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm font-semibold mb-3">
                      🏆 Best Match
                    </div>
                    <h3 className="text-3xl font-bold mb-2">{top1Job.name}</h3>
                    <p className="text-indigo-100 text-lg">{top1Job.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold">{top1Job.score}점</div>
                    <div className="text-indigo-100 text-sm mt-1">적합도 점수</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="w-5 h-5" />
                      <span className="font-semibold">예상 연봉</span>
                    </div>
                    <p className="text-indigo-100">{top1Job.salary}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-semibold">시장 성장률</span>
                    </div>
                    <p className="text-indigo-100">전년 대비 {top1Job.growth}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top 3 Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              {topJobs.map((job) => (
                <div key={job.rank} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  {/* 헤더 */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg ${
                        job.rank === 1 ? 'bg-gradient-to-br from-indigo-500 to-purple-600' :
                        job.rank === 2 ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                        'bg-gradient-to-br from-pink-500 to-rose-600'
                      }`}>
                        {job.rank}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{job.name}</h3>
                        <p className="text-gray-500">{job.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold">
                            {job.score}점 ({job.percentage}%)
                          </span>
                          <span className={`text-sm font-semibold ${getGrowthColor(job.growth)}`}>
                            {job.growth} 성장
                          </span>
                          <span className="text-sm text-gray-500">수요: {job.demand}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 하는 일 */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Briefcase className="w-5 h-5 text-gray-700" />
                        <h4 className="font-bold text-gray-900">주요 업무</h4>
                      </div>
                      <ul className="space-y-2">
                        {job.responsibilities.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <ChevronRight className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 필요 스킬 */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <GraduationCap className="w-5 h-5 text-gray-700" />
                        <h4 className="font-bold text-gray-900">필요 스킬</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 취업 가능 기업 */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="w-5 h-5 text-gray-700" />
                      <h4 className="font-bold text-gray-900">취업 가능 기업</h4>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {job.companies.map((company, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl text-sm font-semibold text-gray-900 hover:shadow-md transition-all"
                        >
                          {company}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 연봉 정보 */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-gray-900">예상 연봉</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">{job.salary}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Career Path Tab */}
          {activeTab === 'path' && (
            <div className="space-y-6">
              {/* 커리어 로드맵 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {top1Job.name} 커리어 로드맵
                </h3>
                
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        1
                      </div>
                      <div className="w-0.5 h-full bg-gradient-to-b from-indigo-500 to-purple-600 mt-2" />
                    </div>
                    <div className="flex-1 pb-8">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">기초 학습 (0-6개월)</h4>
                      <p className="text-gray-600 mb-4">필수 스킬과 도구를 학습하는 단계</p>
                      <div className="bg-indigo-50 rounded-xl p-4">
                        <div className="font-semibold text-gray-900 mb-2">학습 항목</div>
                        <div className="flex flex-wrap gap-2">
                          {top1Job.skills.slice(0, 4).map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-white rounded-lg text-sm font-medium text-gray-700 border border-indigo-100">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        2
                      </div>
                      <div className="w-0.5 h-full bg-gradient-to-b from-purple-500 to-pink-600 mt-2" />
                    </div>
                    <div className="flex-1 pb-8">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">프로젝트 경험 (6-12개월)</h4>
                      <p className="text-gray-600 mb-4">실전 프로젝트로 포트폴리오 구축</p>
                      <div className="bg-purple-50 rounded-xl p-4">
                        <div className="font-semibold text-gray-900 mb-2">추천 활동</div>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <ChevronRight className="w-4 h-4 text-purple-500 mt-0.5" />
                            <span>인턴십 또는 현장실습 경험</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <ChevronRight className="w-4 h-4 text-purple-500 mt-0.5" />
                            <span>토이 프로젝트 또는 공모전 참여</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <ChevronRight className="w-4 h-4 text-purple-500 mt-0.5" />
                            <span>스터디 및 커뮤니티 활동</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        3
                      </div>
                      <div className="w-0.5 h-full bg-gradient-to-b from-pink-500 to-rose-600 mt-2" />
                    </div>
                    <div className="flex-1 pb-8">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">취업 준비 (12-18개월)</h4>
                      <p className="text-gray-600 mb-4">이력서, 포트폴리오, 면접 준비</p>
                      <div className="bg-pink-50 rounded-xl p-4">
                        <div className="font-semibold text-gray-900 mb-2">준비 사항</div>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <ChevronRight className="w-4 h-4 text-pink-500 mt-0.5" />
                            <span>이력서 및 포트폴리오 제작</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <ChevronRight className="w-4 h-4 text-pink-500 mt-0.5" />
                            <span>모의 면접 및 코딩테스트 준비</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <ChevronRight className="w-4 h-4 text-pink-500 mt-0.5" />
                            <span>네트워킹 및 채용 공고 지원</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        4
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">신입 입사 🎉</h4>
                      <p className="text-gray-600 mb-4">첫 직장에서의 성장과 경력 쌓기</p>
                      <div className="bg-green-50 rounded-xl p-4">
                        <div className="font-semibold text-gray-900 mb-2">기대 효과</div>
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            <div>
                              <div className="text-xs text-gray-500">예상 연봉</div>
                              <div className="font-semibold text-gray-900">{top1Job.salary.split('~')[0].trim()}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <div>
                              <div className="text-xs text-gray-500">시장 성장률</div>
                              <div className="font-semibold text-gray-900">{top1Job.growth}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 추천 학습 리소스 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    추천 온라인 강의
                  </h4>
                  <ul className="space-y-3">
                    {['인프런', '유데미', '패스트캠퍼스', '구글 스킬샵'].map((platform, index) => (
                      <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                        <span className="text-sm font-medium text-gray-700">{platform}</span>
                        <ArrowUpRight className="w-4 h-4 text-gray-400" />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    추천 커뮤니티
                  </h4>
                  <ul className="space-y-3">
                    {['디스콰이엇', '오픈채팅방', 'GitHub', 'LinkedIn'].map((community, index) => (
                      <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                        <span className="text-sm font-medium text-gray-700">{community}</span>
                        <ArrowUpRight className="w-4 h-4 text-gray-400" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-8 py-4">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
