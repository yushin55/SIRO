> 백엔드(API 서버)는 이미 구축되어 있으며, 인증 없이 `x-user-id` 헤더로 사용자 식별을 수행합니다.  
> 프론트엔드는 Next.js 기반의 **간결한 구조**로 구성됩니다.
> 간결함을 위해서 **테스트 관련 내용은 모두 생략**합니다.

## Framework

- **Next.js 14.0.4 (App Router)** — 파일 기반 라우팅 및 SSR/CSR 관리
- **TypeScript 5.3** — 정적 타입 안정성 확보
- **React 18.2** — 컴포넌트 기반 UI 구현
- **Tailwind CSS 3.4** — 빠르고 일관된 UI 스타일링

## API 연동

- **Axios 1.6** — HTTP 클라이언트, `x-user-id` 헤더 포함
- **TanStack Query (React Query) 5.17** — 서버 상태 관리 및 캐싱
- **환경변수 관리** — `.env.local` 파일에 `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`
- **데이터 타입 정의** — TypeScript 인터페이스로 API 응답 타입 정의

## 상태 관리

- **React Hooks (`useState`, `useEffect`)** — 로컬 상태 관리
- **TanStack Query** — 서버 상태 관리 (캐싱, 리페칭)
- **Zustand 4.4** — 가벼운 전역 상태 관리 (사용자 인증 등)
- **localStorage** — 로그인 후 `x-user-id` 저장 및 불러오기

## 추가 라이브러리

- **React Hook Form 7.49** — 폼 상태 관리 및 유효성 검증
- **Zod 3.22** — 스키마 기반 유효성 검증
- **Framer Motion 10.16** — 애니메이션 및 인터랙션
- **React Hot Toast 2.4** — 토스트 알림 메시지
- **date-fns 3.0** — 날짜 포맷팅 및 처리

## CORS 설정

### 개발 환경 (localhost)
- **API 서버**: `http://localhost:8000`
- **프론트엔드**: `http://localhost:3000`

### Next.js Proxy 설정
`next.config.js`에 rewrites 추가:

```javascript
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ]
  },
}
```

### Axios 인스턴스 설정
`lib/axios.ts`:

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// x-user-id 헤더 자동 추가
api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('x-user-id')
  if (userId) {
    config.headers['x-user-id'] = userId
  }
  return config
})

export default api
```

### 환경 변수 설정
`.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

프로덕션에서는 실제 API 도메인으로 변경.
