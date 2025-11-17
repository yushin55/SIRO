'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-[#EAEBEC] z-50">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#25A778] rounded-[8px] flex items-center justify-center">
                <span className="text-white font-extrabold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-[#1B1C1E]">PROOF</span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/auth/login" 
                className="px-4 py-2 text-sm font-medium text-[#1B1C1E] hover:text-[#25A778] transition-colors"
              >
                로그인
              </Link>
              <Link 
                href="/auth/register" 
                className="px-5 py-2 bg-[#25A778] text-white font-bold rounded-[12px] text-sm hover:bg-[#2DC98E] transition-all"
              >
                시작하기
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-[#1B1C1E] mb-6">
            당신의 경험을 체계적으로 관리하세요
          </h1>
          <p className="text-xl text-[#1B1C1E]/70 mb-8 max-w-2xl mx-auto">
            프루프는 여러분의 프로젝트와 활동을 기록하고, AI로 자동 분석하여 포트폴리오를 구축합니다
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/auth/register" 
              className="px-8 py-4 bg-[#25A778] text-white font-bold rounded-[16px] text-lg hover:bg-[#2DC98E] transition-all"
            >
              무료로 시작하기
            </Link>
            <button className="px-8 py-4 bg-white border-2 border-[#EAEBEC] text-[#1B1C1E] font-bold rounded-[16px] text-lg hover:border-[#25A778] transition-all">
              자세히 알아보기
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 bg-[#F1F2F3]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#1B1C1E] mb-4">
            왜 PROOF를 선택해야 할까요?
          </h2>
          <p className="text-center text-[#1B1C1E]/70 mb-12 max-w-2xl mx-auto">
            프루프는 단순한 기록 도구가 아닙니다. 당신의 성장을 함께합니다.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[20px] p-8 border border-[#EAEBEC]">
              <div className="w-12 h-12 bg-[#DDF3EB] rounded-[12px] flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-[#25A778]">1</span>
              </div>
              <h3 className="text-xl font-bold text-[#1B1C1E] mb-3">간편한 기록</h3>
              <p className="text-[#1B1C1E]/70">
                프로젝트와 활동을 빠르게 기록하고 관리하세요. 간단한 인터페이스로 누구나 쉽게 사용할 수 있습니다.
              </p>
            </div>

            <div className="bg-white rounded-[20px] p-8 border border-[#EAEBEC]">
              <div className="w-12 h-12 bg-[#E8F1FF] rounded-[12px] flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-[#418CC3]">2</span>
              </div>
              <h3 className="text-xl font-bold text-[#1B1C1E] mb-3">AI 자동 분석</h3>
              <p className="text-[#1B1C1E]/70">
                입력한 내용을 AI가 자동으로 분석하여 키워드와 태그를 추출합니다. 시간을 절약하세요.
              </p>
            </div>

            <div className="bg-white rounded-[20px] p-8 border border-[#EAEBEC]">
              <div className="w-12 h-12 bg-[#F0E8FF] rounded-[12px] flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-[#9C6BB3]">3</span>
              </div>
              <h3 className="text-xl font-bold text-[#1B1C1E] mb-3">포트폴리오 생성</h3>
              <p className="text-[#1B1C1E]/70">
                축적된 데이터를 바탕으로 자동으로 포트폴리오를 생성합니다. 취업과 이직에 활용하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#1B1C1E] mb-12">
            어떻게 작동하나요?
          </h2>
          
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-[#25A778] rounded-[12px] flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-white">1</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1B1C1E] mb-2">프로젝트와 활동 기록</h3>
                <p className="text-[#1B1C1E]/70">
                  참여한 프로젝트, 공모전, 인턴십 등 모든 활동을 프루프에 기록하세요. 날짜, 역할, 내용을 상세히 적을수록 좋습니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-[#418CC3] rounded-[12px] flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-white">2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1B1C1E] mb-2">AI가 자동으로 분석</h3>
                <p className="text-[#1B1C1E]/70">
                  입력한 내용을 AI가 분석하여 핵심 키워드, 사용 기술, 역량을 자동으로 추출합니다. 수동 태깅은 필요 없습니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-[#9C6BB3] rounded-[12px] flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1B1C1E] mb-2">포트폴리오 완성</h3>
                <p className="text-[#1B1C1E]/70">
                  축적된 데이터를 바탕으로 자동으로 포트폴리오가 생성됩니다. 언제든 다운로드하고 공유할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 bg-[#25A778]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-white/90 mb-8">
            무료로 가입하고 당신의 경험을 체계적으로 관리하세요
          </p>
          <Link 
            href="/auth/register" 
            className="inline-block px-10 py-4 bg-white text-[#25A778] font-bold rounded-[16px] text-lg hover:bg-[#F1F2F3] transition-all"
          >
            무료로 시작하기
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 bg-[#1B1C1E]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#25A778] rounded-[8px] flex items-center justify-center">
              <span className="text-white font-extrabold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-white">PROOF</span>
          </div>
          <p className="text-white/50 text-sm">
            © 2024 PROOF. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
