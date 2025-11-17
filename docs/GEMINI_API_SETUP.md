# Gemini API 설정 가이드

## ❌ 현재 문제

Gemini API 키가 올바르지 않아 진로봇이 작동하지 않습니다.

**현재 `.env.local`의 API 키**:
```
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyBmXVTLV2f3aKIkCxeR49PSA5af964492g
```

이 키는 **유효하지 않은 형식**입니다.

---

## ✅ 올바른 설정 방법

### 1단계: API 키 발급

1. **Google AI Studio** 접속
   - URL: https://aistudio.google.com/app/apikey
   - (구 makersuite.google.com)

2. **Google 계정 로그인**

3. **"API Key 생성" 버튼 클릭**

4. **API 키 복사**
   - 형식: `AIza...` (39자)
   - 예시: `AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

### 2단계: `.env.local` 파일 수정

파일 위치: `front/.env.local`

```env
# API 베이스 URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Google Gemini API
# 아래에 복사한 API 키를 붙여넣기
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy여기에실제키를붙여넣기

# 환경
NEXT_PUBLIC_ENV=development
```

### 3단계: 개발 서버 재시작

```powershell
# 현재 실행 중인 서버 중지 (Ctrl+C)
# 그 다음 다시 실행
npm run dev
```

### 4단계: 테스트

1. http://localhost:3000/dashboard/recommendations 접속
2. "경험 추천받기" 버튼 클릭
3. AI 인트로 메시지가 나오면 성공!

---

## 🔍 문제 확인 방법

### 브라우저 개발자 도구에서 확인

1. **F12** 키로 개발자 도구 열기
2. **Console** 탭 확인
   - ❌ 에러가 있다면:
     ```
     Error: API key not valid. Please pass a valid API key.
     ```
   - ✅ 정상이라면:
     ```
     (에러 없음, 채팅 메시지가 표시됨)
     ```

3. **Network** 탭 확인
   - `generativelanguage.googleapis.com` 요청 확인
   - Status가 200이면 정상, 400/401이면 API 키 오류

---

## 🆘 API 키 발급이 안 되는 경우

### A. 국가 제한
Gemini API는 일부 국가에서만 사용 가능합니다.
- 한국: ✅ 사용 가능
- 확인: https://ai.google.dev/available_regions

### B. Google Cloud 프로젝트 필요
무료 할당량:
- **60 requests per minute**
- **1,500 requests per day**

결제 정보 등록 없이 무료로 사용 가능합니다.

### C. VPN 사용 중인 경우
VPN을 끄고 다시 시도해보세요.

---

## 📌 참고: API 키 보안

**절대 하지 말 것**:
- ❌ GitHub에 `.env.local` 파일 커밋
- ❌ API 키를 코드에 직접 입력
- ❌ 공개된 곳에 API 키 공유

**해야 할 것**:
- ✅ `.gitignore`에 `.env.local` 추가됨 (이미 설정됨)
- ✅ 환경 변수로만 관리
- ✅ API 키 노출 시 즉시 재발급

---

## 🎯 현재 설정 상태

현재 프로젝트 파일:
- ✅ `lib/gemini.ts`: Gemini 설정 완료
- ✅ `components/CareerBot.tsx`: 채팅 UI 완료
- ✅ `.env.local.example`: 예시 파일 있음
- ❌ `.env.local`: **API 키가 올바르지 않음**

**해결 방법**: 위의 "1단계: API 키 발급"부터 다시 진행하세요.

---

## 💡 빠른 테스트 (API 키 없이)

API 키를 당장 발급받을 수 없다면, 임시로 UI만 테스트:

```typescript
// lib/gemini.ts 임시 수정 (테스트용)
export const createCareerBotChat = () => {
  // 임시 Mock 응답
  return {
    sendMessage: async (msg: string) => ({
      response: {
        text: () => `[Mock] "${msg}"에 대한 임시 응답입니다. 실제로는 Gemini API 키가 필요합니다.`
      }
    })
  };
};
```

**주의**: 이것은 테스트용이며, 실제 기능은 작동하지 않습니다.
