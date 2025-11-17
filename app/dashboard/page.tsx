'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const mockLogs = [
    { 
      id: 1, 
      project: '서버랩 D-1',
      title: '디프만 15기 디자이너 작곡', 
      date: '2024 상반기',
      period: '서류 준비',
      keywords: ['협업', '리더십', 'React']
    },
    { 
      id: 2, 
      project: '2차 면접 D-2',
      title: '2024 네이버 공채', 
      date: '2024 상반기',
      period: '서류 준비',
      keywords: ['코딩', '문제해결', 'Python']
    },
    { 
      id: 3, 
      project: '2차 면접 D-2',
      title: '토스 어시스턴트 계약직', 
      date: '2024 상반기',
      period: '면접 합격',
      keywords: ['디자인', 'UX', 'Figma']
    },
    { 
      id: 4, 
      project: '1차 면접 D-9',
      title: '카카오 BX 어시스턴트', 
      date: '2024 상반기',
      period: '서류 합격',
      keywords: ['협업', '개발']
    },
    { 
      id: 5, 
      project: '2차 면접 D-12',
      title: '현대자동차 채용 전환형 인턴', 
      date: '2024 상반기',
      period: '면접 합격',
      keywords: ['인턴', '전환']
    }
  ]

  return (
    <div className="min-h-screen bg-[#F1F2F3]">
      {/* Header */}
      <div className="bg-white px-8 py-6 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1B1C1E]">내 공고</h1>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-[#EAEBEC] rounded-[12px] text-sm font-medium text-[#1B1C1E] hover:border-[#25A778] transition-all">
              내 정보 가져오기
            </button>
            <Link 
              href="/dashboard/spaces/new"
              className="px-4 py-2 bg-[#25A778] text-white rounded-[12px] text-sm font-bold hover:bg-[#2DC98E] transition-all"
            >
              + 새 스페이스
            </Link>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8">
        {/* Section Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 bg-[#25A778] rounded-full"></div>
            <h2 className="text-base font-bold text-[#1B1C1E]">현재 진행중인 공고 모아보기</h2>
          </div>
        </div>

        {/* Logs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {mockLogs.map((log) => (
            <div 
              key={log.id} 
              className="bg-white rounded-[16px] p-5 border border-[#EAEBEC] hover:border-[#25A778] transition-all cursor-pointer"
            >
              {/* Project Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#25A778] rounded-[2px]"></div>
                  <span className="text-xs font-bold text-[#25A778]">{log.project}</span>
                </div>
                <button className="text-[#1B1C1E]/30 hover:text-[#1B1C1E]/60 text-lg">⋮</button>
              </div>

              {/* Date Badge */}
              <div className="mb-3">
                <span className="inline-block px-2.5 py-1 bg-[#DDF3EB] text-[#186D50] rounded-[6px] text-xs font-bold">
                  {log.date}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-sm text-[#1B1C1E] mb-2 line-clamp-2 min-h-[40px]">
                {log.title}
              </h3>

              {/* Period */}
              <div className="mb-3">
                <span className="text-xs text-[#1B1C1E]/50 font-medium">{log.period}</span>
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap gap-1.5">
                {log.keywords.map((keyword, index) => (
                  <span 
                    key={index} 
                    className={`px-2 py-1 rounded-[6px] text-xs font-medium ${
                      index % 3 === 0 
                        ? 'bg-[#E8F1FF] text-[#418CC3]' 
                        : index % 3 === 1 
                        ? 'bg-[#F0E8FF] text-[#9C6BB3]'
                        : 'bg-[#FFF3C2] text-[#D77B0F]'
                    }`}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* All Logs Section */}
        <div className="mb-4 mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#25A778] rounded-full"></div>
              <h2 className="text-base font-bold text-[#1B1C1E]">모든 공고</h2>
            </div>
            <button className="text-xs text-[#1B1C1E]/50 font-medium hover:text-[#1B1C1E]/70">
              간략히 보기
            </button>
          </div>
        </div>

        {/* All Logs List */}
        <div className="space-y-3">
          {mockLogs.slice(0, 3).map((log) => (
            <div 
              key={log.id}
              className="bg-white rounded-[12px] px-5 py-4 border border-[#EAEBEC] hover:border-[#25A778] transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-xs font-medium text-[#1B1C1E]/50 w-20">{log.date}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#25A778] rounded-[2px]"></div>
                    <span className="text-xs font-bold text-[#25A778] w-28">{log.project}</span>
                  </div>
                  <h3 className="font-bold text-sm text-[#1B1C1E] flex-1">{log.title}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-[#1B1C1E]/50 font-medium">{log.period}</span>
                  <button className="text-[#1B1C1E]/30 hover:text-[#1B1C1E]/60 text-lg">⋮</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
