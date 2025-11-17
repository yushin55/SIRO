'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Send, Loader2, CheckCircle2, Briefcase, Trophy, Users, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { createCareerBotChat } from '@/lib/gemini';
import type { ChatSession } from '@google/generative-ai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  options?: OptionCard[];
}

interface OptionCard {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  color?: string;
  bgGradient?: string;
}

export default function CareerBotModal({
  onClose,
  onComplete,
}: any) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentStep, setCurrentStep] = useState('intro');
  const [selectedOptions, setSelectedOptions] = useState<{[key: string]: string}>({});
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 선택지 정의
  const getOptionsForStep = (step: string): OptionCard[] => {
    switch(step) {
      case 'grade':
        return [
          { id: '1학년', label: '1학년', icon: '🎓', bgGradient: 'from-orange-300 to-orange-400' },
          { id: '2학년', label: '2학년', icon: '📚', bgGradient: 'from-blue-300 to-purple-400' },
          { id: '3학년', label: '3학년', icon: '📖', bgGradient: 'from-pink-300 to-pink-400' },
          { id: '4학년 이상', label: '4학년 이상', icon: '🎯', bgGradient: 'from-yellow-300 to-orange-300' },
          { id: '휴학·졸업 후 준비 중', label: '휴학·졸업 후', icon: '💼', bgGradient: 'from-red-300 to-pink-300' }
        ];
      case 'career_stage':
        return [
          { id: '아직 거의 생각 못 해봤어요', label: '거의 생각 못 해봤어요', description: '진로 탐색을 시작하는 단계', icon: '🤔', bgGradient: 'from-purple-300 to-purple-400' },
          { id: '대략 몇 개 직무가 떠오르긴 해요', label: '몇 개 직무가 떠올라요', description: '방향성은 있지만 확신이 없는 단계', icon: '🧭', bgGradient: 'from-blue-300 to-cyan-400' },
          { id: '꽤 고민해봤는데, 확신이 없어요', label: '고민했지만 확신이 없어요', description: '구체적으로 고민 중인 단계', icon: '💭', bgGradient: 'from-green-300 to-emerald-400' },
          { id: '거의 정했어요 (최종 점검만 하고 싶어요)', label: '거의 정했어요', description: '최종 점검이 필요한 단계', icon: '✅', bgGradient: 'from-pink-300 to-rose-400' }
        ];
      case 'role':
        return [
          { id: '전체 흐름 설계하고 역할을 나누는 사람', label: '전체 흐름 설계', description: '프로젝트 리더', icon: '🎯', color: '#418CC3' },
          { id: '아이디어 내고 발표 자료를 예쁘게 만드는 사람', label: '아이디어 & 발표자료', description: '크리에이티브', icon: '💡', color: '#25A778' },
          { id: '숫자·데이터를 정리하고 분석하는 사람', label: '숫자·데이터 분석', description: '데이터 전문가', icon: '📊', color: '#D77B0F' },
          { id: '사람들 사이를 중재하고 분위기를 맞추는 사람', label: '중재 & 분위기 메이커', description: '팀 조율자', icon: '🤝', color: '#9C6BB3' },
          { id: '일정·업무를 꼼꼼히 체크하는 사람', label: '일정·업무 관리', description: '프로세스 관리자', icon: '✓', color: '#186D50' },
          { id: '직접 나가서 사람을 만나고 설득하는 사람', label: '대외활동 & 설득', description: '커뮤니케이터', icon: '🗣️', color: '#DC2626' }
        ];
      case 'achievement':
        return [
          { id: '어려운 문제를 논리적으로 풀어서 전략을 만들었을 때', label: '전략 수립', description: '논리적 문제 해결', icon: '🧩' },
          { id: '우리 팀 아이디어가 사람들 반응을 많이 끌어냈을 때', label: '아이디어 반응', description: '창의적 성과', icon: '🌟' },
          { id: '숫자나 비용이 눈에 띄게 개선되었을 때', label: '수치 개선', description: '정량적 성과', icon: '📈' },
          { id: '누군가가 "덕분에 많이 편해졌어요/성장했어요"라고 말해줬을 때', label: '사람 성장 지원', description: '긍정적 영향', icon: '🌱' },
          { id: '현장이나 프로세스가 눈에 띄게 효율적으로 바뀌었을 때', label: '프로세스 개선', description: '효율성 향상', icon: '⚡' },
          { id: '직접 설득해서 거래·협업이 성사되었을 때', label: '설득 & 성사', description: '협상 성공', icon: '🤝' }
        ];
      case 'value':
        return [
          { id: '큰 그림·전략', label: '큰 그림·전략', icon: '🎯', color: '#418CC3' },
          { id: '창의성·브랜드 이미지', label: '창의성·브랜드', icon: '🎨', color: '#25A778' },
          { id: '안정성·정확한 숫자', label: '안정성·숫자', icon: '📊', color: '#D77B0F' },
          { id: '사람·조직문화', label: '사람·조직문화', icon: '👥', color: '#9C6BB3' },
          { id: '효율·시스템', label: '효율·시스템', icon: '⚙️', color: '#186D50' },
          { id: '성과·매출', label: '성과·매출', icon: '💰', color: '#DC2626' }
        ];
      case 'activity_type':
        return [
          { id: '공모전', label: '공모전', description: '상금과 수상 경력', icon: '🏆', color: '#F59E0B' },
          { id: '학회/동아리', label: '학회/동아리', description: '지속적인 학습과 네트워킹', icon: '👥', color: '#8B5CF6' },
          { id: '프로젝트(교내/개인)', label: '프로젝트', description: '실무 경험 쌓기', icon: '💡', color: '#10B981' },
          { id: '인턴/현장실습', label: '인턴십', description: '기업 실무 경험', icon: '💼', color: '#3B82F6' },
          { id: '다 상관없어요, 그냥 추천해 주세요', label: '추천 받기', description: '맞춤 추천', icon: '✨', color: '#EC4899' }
        ];
      default:
        return [];
    }
  };

  // 카드 선택 핸들러
  const handleCardSelect = async (optionId: string) => {
    if (isLoading || !chatSession) return;

    setSelectedOptions({...selectedOptions, [currentStep]: optionId});
    
    const userMessage: Message = {
      role: 'user',
      content: optionId,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessage(optionId);
      const response = await result.response;
      const text = response.text();

      // JSON 추출
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      let careerData = null;
      
      if (jsonMatch) {
        try {
          careerData = JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.error('JSON parse error:', e);
        }
      }

      // 다음 단계 결정 - 순차적 단계 진행
      let nextStep = '';
      let options: OptionCard[] = [];
      
      // 현재 선택된 옵션 개수로 다음 단계 결정
      const stepOrder = ['grade', 'career_stage', 'role', 'achievement', 'value', 'activity_type'];
      const currentStepIndex = stepOrder.indexOf(currentStep);
      
      if (currentStepIndex >= 0 && currentStepIndex < stepOrder.length - 1) {
        nextStep = stepOrder[currentStepIndex + 1];
        options = getOptionsForStep(nextStep);
      }

      if (nextStep) {
        setCurrentStep(nextStep);
        setCurrentCardIndex(0);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: text.replace(/```json[\s\S]*?```/g, '').trim(),
        timestamp: new Date(),
        options: options
      };

      setMessages(prev => [...prev, assistantMessage]);

      // 완료 확인
      if (careerData && careerData.selected_track && careerData.activity_type) {
        setTimeout(() => {
          const track = careerData.selected_track;
          const field = careerData.selected_track_korean || track;
          const activityType = careerData.activity_type;
          
          const activityTypeMap: { [key: string]: string } = {
            '공모전': 'contest',
            '학회/동아리': 'club',
            '프로젝트(교내/개인)': 'project',
            '프로젝트': 'project',
            '인턴/현장실습': 'internship',
            '인턴': 'internship',
            '다 상관없어요, 그냥 추천해 주세요': 'all',
            '다 상관없어요': 'all'
          };

          const mappedActivityType = activityTypeMap[activityType] || activityType;
          onComplete(track, field, mappedActivityType);
        }, 2000);
      }
    } catch (error) {
      console.error('Send message error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '죄송합니다. 메시지를 처리하는 중 오류가 발생했습니다.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 초기화
  useEffect(() => {
    const initChat = async () => {
      try {
        const session = createCareerBotChat();
        setChatSession(session);
        
        // 인트로 메시지 전송
        const result = await session.sendMessage('추천 받아보기');
        const response = await result.response;
        const text = response.text();
        
        // 첫 메시지에는 학년 카드를 자동으로 표시
        setMessages([
          {
            role: 'assistant',
            content: text,
            timestamp: new Date(),
            options: getOptionsForStep('grade')
          }
        ]);
        setCurrentStep('grade');
        setIsInitialized(true);
      } catch (error) {
        console.error('Chat initialization error:', error);
        setMessages([
          {
            role: 'assistant',
            content: '죄송합니다. 진로봇을 시작하는 중 오류가 발생했습니다. .env.local 파일에 NEXT_PUBLIC_GEMINI_API_KEY를 설정해주세요.',
            timestamp: new Date()
          }
        ]);
      }
    };

    initChat();
  }, []);

  // 텍스트 메시지 전송
  const handleSend = async () => {
    if (!input.trim() || !chatSession || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessage(input);
      const response = await result.response;
      const text = response.text();

      // JSON 추출
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      let careerData = null;
      
      if (jsonMatch) {
        try {
          careerData = JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.error('JSON parse error:', e);
        }
      }

      // 다음 단계 결정 - 순차적 단계 진행
      let nextStep = '';
      let options: OptionCard[] = [];
      
      // 현재 선택된 옵션 개수로 다음 단계 결정
      const stepOrder = ['grade', 'career_stage', 'role', 'achievement', 'value', 'activity_type'];
      const currentStepIndex = stepOrder.indexOf(currentStep);
      
      if (currentStepIndex >= 0 && currentStepIndex < stepOrder.length - 1) {
        nextStep = stepOrder[currentStepIndex + 1];
        options = getOptionsForStep(nextStep);
      }

      if (nextStep) {
        setCurrentStep(nextStep);
        setCurrentCardIndex(0);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: text.replace(/```json[\s\S]*?```/g, '').trim(),
        timestamp: new Date(),
        options: options
      };

      setMessages(prev => [...prev, assistantMessage]);

      // 완료 확인 (JSON이 있고 selected_track이 있으면 완료)
      if (careerData && careerData.selected_track && careerData.activity_type) {
        setTimeout(() => {
          const track = careerData.selected_track;
          const field = careerData.selected_track_korean || track;
          const activityType = careerData.activity_type;
          
          // 활동 타입 매핑
          const activityTypeMap: { [key: string]: string } = {
            '공모전': 'contest',
            '학회/동아리': 'club',
            '프로젝트(교내/개인)': 'project',
            '프로젝트': 'project',
            '인턴/현장실습': 'internship',
            '인턴': 'internship',
            '다 상관없어요, 그냥 추천해 주세요': 'all',
            '다 상관없어요': 'all'
          };

          const mappedActivityType = activityTypeMap[activityType] || activityType;
          
          onComplete(track, field, mappedActivityType);
        }, 2000);
      }
    } catch (error) {
      console.error('Send message error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '죄송합니다. 메시지를 처리하는 중 오류가 발생했습니다.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // Enter 키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-[98vw] h-[98vh] flex flex-col shadow-2xl">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-[#DDF3EB] via-[#E8F1FF] to-[#F0E7FF] border-b border-[#EAEBEC] p-8 rounded-t-3xl flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#25A778] to-[#2DC98E] rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1B1C1E]">ProoF 진로봇 P</h2>
              <p className="text-sm text-[#6B6D70] mt-1">
                {isInitialized ? '💬 AI와 함께 나에게 맞는 경험을 찾아보세요' : '🔄 연결 중...'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/70 rounded-xl transition-all">
            <X className="w-6 h-6 text-[#6B6D70]" />
          </button>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6" style={{ zoom: 0.7 }}>
          {messages.map((message, index) => (
            <div key={index} className="space-y-4">
              <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-6 py-4 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-[#25A778] to-[#2DC98E] text-white'
                      : 'bg-[#F1F2F3] text-[#1B1C1E]'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-base leading-relaxed">
                    {message.content}
                  </div>
                  <div
                    className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-white/80' : 'text-[#6B6D70]'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>

              {/* 선택지 카드 - 깔끔한 화이트 카드 스타일 */}
              {message.options && message.options.length > 0 && index === messages.length - 1 && (
                <div className="mt-10 px-8">
                  <div className="grid grid-cols-3 gap-6">
                    {message.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleCardSelect(option.id)}
                        disabled={isLoading}
                        className={`group bg-white rounded-2xl p-8 transition-all duration-300 hover:shadow-xl border-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[320px] flex flex-col ${
                          selectedOptions[currentStep] === option.id 
                            ? 'border-[#25A778] shadow-lg scale-[1.02]' 
                            : 'border-gray-200 hover:border-gray-300 shadow-md'
                        }`}
                      >
                        {/* 아이콘 영역 - 원형 배경 */}
                        <div className="flex justify-center mb-6">
                          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                            selectedOptions[currentStep] === option.id 
                              ? 'bg-gradient-to-br from-[#25A778] to-[#2DC98E]' 
                              : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-[#DDF3EB] group-hover:to-[#E8F1FF]'
                          } transition-all duration-300`}>
                            <span className="text-5xl">{option.icon}</span>
                          </div>
                        </div>

                        {/* 타이틀 */}
                        <div className="flex-1 flex flex-col items-center justify-center">
                          <h3 className={`text-xl font-bold text-center mb-2 transition-colors ${
                            selectedOptions[currentStep] === option.id 
                              ? 'text-[#25A778]' 
                              : 'text-[#1B1C1E] group-hover:text-[#25A778]'
                          }`}>
                            {option.label}
                          </h3>
                          {option.description && (
                            <p className="text-sm text-[#6B6D70] text-center leading-relaxed px-2">
                              {option.description}
                            </p>
                          )}
                        </div>

                        {/* 선택 체크 표시 */}
                        {selectedOptions[currentStep] === option.id && (
                          <div className="flex justify-center mt-4">
                            <div className="bg-[#25A778] rounded-full p-2">
                              <CheckCircle2 className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        )}

                        {/* 하단 구분선 */}
                        <div className={`mt-6 pt-4 border-t transition-colors ${
                          selectedOptions[currentStep] === option.id 
                            ? 'border-[#25A778]/20' 
                            : 'border-gray-100'
                        }`}>
                          <div className="flex items-center justify-center gap-2 text-xs text-[#6B6D70]">
                            <div className={`w-2 h-2 rounded-full transition-colors ${
                              selectedOptions[currentStep] === option.id 
                                ? 'bg-[#25A778]' 
                                : 'bg-gray-300'
                            }`}></div>
                            <span>{selectedOptions[currentStep] === option.id ? '선택됨' : '선택하기'}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start px-4">
              <div className="bg-gradient-to-r from-[#F1F2F3] to-[#E8F1FF] rounded-2xl px-6 py-4 flex items-center gap-3 shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin text-[#25A778]" />
                <span className="text-base text-[#6B6D70]">생각하는 중...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 - 자유 입력도 가능 */}
        <div className="border-t border-[#EAEBEC] p-6 flex-shrink-0 bg-gradient-to-b from-white to-[#FAFBFC] rounded-b-3xl">
          <div className="flex gap-3 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isLoading ? '응답을 기다리는 중...' : '직접 입력하거나 위의 카드를 선택하세요'}
              disabled={isLoading || !isInitialized}
              className="flex-1 px-6 py-4 border-2 border-[#EAEBEC] rounded-2xl focus:outline-none focus:border-[#25A778] focus:ring-4 focus:ring-[#25A778]/10 disabled:opacity-50 disabled:cursor-not-allowed text-base transition-all shadow-sm"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || !isInitialized}
              className="px-7 py-4 bg-gradient-to-r from-[#25A778] to-[#2DC98E] text-white rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-bold text-base"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </button>
          </div>
          <p className="text-sm text-[#6B6D70] mt-3 text-center">
            💡 위의 카드를 클릭하거나 직접 메시지를 입력하세요
          </p>
        </div>
      </div>
    </div>
  );
}
