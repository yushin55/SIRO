"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// 이 페이지는 더 이상 전체 직무 그리드를 보여주지 않습니다.
// - 사용자가 `career` 페이지에서 직무를 선택/추천 받으면 해당 jobId를 localStorage에 저장합니다.
// - 이 페이지는 localStorage에서 `selected_job` 또는 `recommended_job` 을 찾아 자동으로 해당 스펙체크 페이지로 이동합니다.
// - 찾을 수 없으면 사용자가 직무 선택 설문으로 이동할 수 있는 안내만 표시합니다.

export default function SpecCheckPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // 클라이언트 측에서만 동작
    try {
      const selected = typeof window !== 'undefined' ? window.localStorage.getItem('selected_job') : null
      const recommended = typeof window !== 'undefined' ? window.localStorage.getItem('recommended_job') : null

      const jobId = selected || recommended
      if (jobId) {
        // 있으면 바로 스펙체크 페이지로 이동
        router.replace(`/dashboard/spec-check/${jobId}`)
        return
      }
    } catch (e) {
      console.error('SpecCheck redirect error:', e)
    } finally {
      setChecking(false)
    }
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">스펙체크 준비중...</p>
        </div>
      </div>
    )
  }

  // selected/recommended job 이 없을 때의 간단한 안내 UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
        <div className="text-6xl mb-6">✨</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">스펙체크 시작</h1>
        <p className="text-gray-700 mb-6">직무를 아직 선택하지 않으셨네요. 먼저 직무 선택 설문을 진행해 추천받거나, 원하는 직무를 선택한 후 스펙체크를 시작하세요.</p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => router.push('/dashboard/career')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
          >
            직무 선택 설문하러 가기 →
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-white border-2 border-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    </div>
  )
}
