'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface Question {
  id: string
  type: 'likert' | 'text' | 'multiple_choice' | 'single_choice'
  text: string
  options?: Array<{ value: string; label: string }>
  placeholder?: string
  optional?: boolean
}

interface SpecCheckData {
  survey_id: string
  job_category: string
  title: string
  description: string
  questions: Question[]
}

interface SpecCheckResult {
  job_category: string
  submitted_at: string
  total_questions: number
  score_map: Record<string, number>
  top_specializations: Array<{ subtype_id: string; name: string; description?: string; score: number; reason?: string }>
  preference_top3: Array<{ subtype_id: string; name: string; score: number; reason?: string }>
  fit_top3: Array<{ subtype_id: string; name: string; score: number; reason?: string }>
  recommended_specialization: { subtype_id: string; name: string; description?: string; score: number; reason?: string }
  insights: string[]
}

const JOB_NAMES: Record<string, string> = {
  marketing: '마케팅',
  hr: '인사/HR',
  brand: '브랜드/상품 기획',
  strategy: '전략/기획',
  finance: '재무/회계',
  sales: '영업/영업관리',
  data: '데이터 분석',
  operations: '운영/SCM'
}

export default function SpecCheckJobPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params?.jobId as string

  const [surveyData, setSurveyData] = useState<SpecCheckData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<SpecCheckResult | null>(null)

  useEffect(() => {
    const loadSurvey = async () => {
      try {
        const response = await fetch(`/data/spec-check-${jobId}.json`)
        if (!response.ok) throw new Error('Survey not found')
        const data = await response.json()
        setSurveyData(data)
      } catch (error) {
        console.error('Failed to load survey:', error)
        alert('설문 데이터를 불러오는 데 실패했습니다.')
        router.push('/dashboard/spec-check')
      } finally {
        setIsLoading(false)
      }
    }
    if (jobId) loadSurvey()
  }, [jobId, router])

  if (isLoading || !surveyData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">스펙체크 설문을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  const currentQuestion = surveyData.questions[currentStep]
  const progress = ((currentStep + 1) / surveyData.questions.length) * 100

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const canProceed = () => {
    const answer = answers[currentQuestion.id]
    if (currentQuestion.optional) return true
    if (currentQuestion.type === 'text') return answer && answer.trim().length > 0
    return answer !== undefined && answer !== null
  }

  const handleNext = () => {
    if (currentStep < surveyData.questions.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const relativeEndpoint = '/api/v1/survey/spec-check/submit'
      const fallbackEndpoint = 'http://localhost:5000/api/v1/survey/spec-check/submit'

      const tryFetch = async (url: string) => {
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ job_category: jobId, answers }),
          })
          return res
        } catch (err) {
          return null
        }
      }

      let response = await tryFetch(relativeEndpoint)
      if (!response) response = await tryFetch(fallbackEndpoint)
      if (!response) throw new Error('서버에 연결할 수 없습니다.')
      if (!response.ok) {
        let txt = '설문 제출 중 오류가 발생했습니다.'
        try {
          const t = await response.text()
          if (t) txt = t
        } catch (e) {}
        throw new Error(txt)
      }
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Survey submission error:', error)
      const msg = (error as any)?.message || String(error) || '설문 제출 중 오류가 발생했습니다.'
      alert(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <button
              onClick={() => router.push('/dashboard/spec-check')}
              className="text-gray-600 hover:text-gray-900 mb-6 flex items-center gap-2"
            >
              ← 돌아가기
            </button>

            <div className="text-center mb-8">
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold mb-4">
                역량 분석
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {JOB_NAMES[jobId]}
              </h2>
              <p className="text-gray-600">
                당신의 경험을 바탕으로 분석한 세부 직무 적합도입니다
              </p>
            </div>

            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="text-6xl mb-4"
              >
                ✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                세부 직무 역량 분석 완료!
              </h2>
              <p className="text-gray-600">
                {surveyData.title.replace(' 스펙체크', '')} 분야의 세부 직무별 적합도를 분석했어요
              </p>
            </div>

            {/* 모든 세부 직무 능력치 바 차트 */}
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📊</span>
                세부 직무별 역량 점수
              </h3>
              {result.top_specializations.map((spec, index) => (
                <motion.div
                  key={spec.subtype_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2 min-w-[180px]">
                        <span className="text-2xl">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📊'}
                        </span>
                        <h3 className="text-base font-bold text-gray-900">
                          {spec.name}
                        </h3>
                      </div>
                      
                      {/* 바 차트 */}
                      <div className="flex-1 h-7 bg-gray-100 rounded-lg overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${spec.score}%` }}
                          transition={{ duration: 1, delay: index * 0.08 + 0.2, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg"
                          style={{
                            background: index === 0 
                              ? 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)'
                              : index === 1
                              ? 'linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%)'
                              : 'linear-gradient(90deg, #93c5fd 0%, #60a5fa 100%)'
                          }}
                        />
                      </div>
                      
                      <span className="text-lg font-bold text-blue-600 min-w-[60px] text-right">
                        {spec.score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 설문 기반 / 역량 기반 Top 3 분리 표시 */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* 설문 기반 Top 3 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>💭</span>
                  선호 기반 Top 3
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  당신이 하고 싶어하는 세부 직무
                </p>
                <div className="space-y-3">
                  {result.preference_top3.map((spec, index) => (
                    <div
                      key={`pref-${spec.subtype_id}`}
                      className="bg-white rounded-xl p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">{spec.name}</span>
                      </div>
                      <span className="text-blue-600 font-bold">{spec.score.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 역량 기반 Top 3 */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>🏆</span>
                  역량 기반 Top 3
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  당신이 잘할 수 있는 세부 직무
                </p>
                <div className="space-y-3">
                  {result.fit_top3.map((spec, index) => (
                    <div
                      key={`fit-${spec.subtype_id}`}
                      className="bg-white rounded-xl p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">{spec.name}</span>
                      </div>
                      <span className="text-green-600 font-bold">{spec.score.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 최종 추천 세부 직무 */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🎯</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">당신에게 가장 적합한 세부 직무</h3>
                  <p className="text-2xl font-bold">
                    {result.recommended_specialization.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/70">적합도</p>
                  <p className="text-3xl font-bold">
                    {result.recommended_specialization.score.toFixed(1)}
                  </p>
                </div>
              </div>
              <p className="text-white/90 text-sm">
                {result.recommended_specialization.reason || '선호도와 역량을 종합적으로 분석한 결과, 당신에게 가장 잘 맞는 세부 직무입니다'}
              </p>
            </div>

            {result.insights?.length ? (
              <div className="mt-6 bg-white rounded-2xl border border-purple-100 p-5">
                <h4 className="text-sm font-semibold text-purple-900 mb-2">분석 한 줄 요약</h4>
                <ul className="list-disc list-inside text-sm text-purple-900 space-y-1">
                  {result.insights.map((insight, index) => (
                    <li key={`insight-${index}`}>{insight}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <button
              onClick={() => router.push('/dashboard/recommendations')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all"
            >
              이 직무로 활동 추천받기 →
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              💡 선택한 직무를 바탕으로 맞춤 공모전, 인턴 등을 추천해드려요
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/spec-check')}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
          >
            ← 돌아가기
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{surveyData.title}</h1>
          <p className="text-gray-600">{surveyData.description}</p>
        </div>

        {/* 프로그레스 바 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              질문 {currentStep + 1} / {surveyData.questions.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% 완료</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* 질문 카드 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl shadow-xl p-8 mb-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">{currentQuestion.text}</h2>

            {/* Likert Scale */}
            {currentQuestion.type === 'likert' && (
              <div className="grid grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map((value) => {
                  const emojis = ['😐', '🙂', '😊', '😄', '🤩']
                  const labels = ['전혀 아니다', '아니다', '보통이다', '그렇다', '매우 그렇다']
                  return (
                    <button
                      key={value}
                      onClick={() => handleAnswer(currentQuestion.id, value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        answers[currentQuestion.id] === value
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <span className="text-3xl">{emojis[value - 1]}</span>
                      <span className="text-xs text-gray-600 text-center">{labels[value - 1]}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Text Input */}
            {currentQuestion.type === 'text' && (
              <textarea
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none resize-none"
                rows={4}
              />
            )}

            {/* Single Choice */}
            {currentQuestion.type === 'single_choice' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                    className={`w-full px-6 py-4 rounded-2xl border-2 text-left transition-all ${
                      answers[currentQuestion.id] === option.value
                        ? 'border-purple-600 bg-purple-50 font-semibold'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            {/* Multiple Choice */}
            {currentQuestion.type === 'multiple_choice' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => {
                  const selected = (answers[currentQuestion.id] || []).includes(option.value)
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        const current = answers[currentQuestion.id] || []
                        const updated = selected
                          ? current.filter((v: string) => v !== option.value)
                          : [...current, option.value]
                        handleAnswer(currentQuestion.id, updated)
                      }}
                      className={`w-full px-6 py-4 rounded-2xl border-2 text-left transition-all ${
                        selected
                          ? 'border-purple-600 bg-purple-50 font-semibold'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selected ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                        }`}>
                          {selected && <span className="text-white text-xs">✓</span>}
                        </div>
                        <span>{option.label}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 네비게이션 버튼 */}
        <div className="flex gap-4">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-6 py-3 border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← 이전
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '제출 중...' : currentStep === surveyData.questions.length - 1 ? '제출하기' : '다음 →'}
          </button>
        </div>
      </div>
    </div>
  )
}
