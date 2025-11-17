# 프론트엔드 UI 기반 백엔드 추가 요구사항

**작성일**: 2024년 11월 14일  
**기준**: 현재 구현된 Next.js 14 프론트엔드 UI

---

## 1. 레이아웃 구조

### 1.1 대시보드 레이아웃
**왼쪽 사이드바 (240px) + 메인 콘텐츠**

**사이드바 메뉴 구조:**
```
┌─ 로고 (PROOF "P")
├─ 내 정보
├─ 대시 검색
├─ 알림
├─────────────────
├─ 내 공고 ⭐ (현재 활성)
├─────────────────
└─ 로그아웃
```

**필요한 API:**
```typescript
GET /api/users/me/quick-info        // 사이드바 사용자 정보
GET /api/dashboard/quick-search     // 빠른 검색
GET /api/notifications/unread-count // 읽지 않은 알림 수
```

---

## 2. 공고 카드 데이터 구조

### 2.1 카드 그리드 (4열)
```typescript
interface LogCard {
  id: string
  project: string                    // "서버랩 D-1"
  projectBadgeColor: string          // "#25A778"
  title: string                      // "디프만 15기 디자이너 작곡"
  date: string                       // "2024 상반기"
  dateBadgeColor: string             // "#DDF3EB"
  period: string                     // "서류 준비"
  keywords: Array<{
    text: string
    color: 'blue' | 'purple' | 'yellow'
  }>
}
```

### 2.2 API 응답 예시
```typescript
GET /api/logs?status=active&limit=8

{
  "success": true,
  "data": [
    {
      "id": "log_123",
      "project": "서버랩 D-1",
      "projectBadgeColor": "#25A778",
      "title": "디프만 15기 디자이너 작곡",
      "date": "2024 상반기",
      "dateBadgeColor": "#DDF3EB",
      "period": "서류 준비",
      "keywords": [
        { "text": "협업", "color": "blue" },
        { "text": "리더십", "color": "purple" },
        { "text": "React", "color": "yellow" }
      ]
    }
  ]
}
```

---

## 3. BBOGAK 색상 시스템

### 3.1 색상 코드
```typescript
// 메인 컬러
const colors = {
  primaryGreen: '#25A778',
  hoverGreen: '#2DC98E',
  lightGreenBg: '#DDF3EB',
  darkGreen: '#186D50',
  
  // 칩/태그 (3색 로테이션)
  blue: { bg: '#E8F1FF', text: '#418CC3' },
  purple: { bg: '#F0E8FF', text: '#9C6BB3' },
  yellow: { bg: '#FFF3C2', text: '#D77B0F' },
  
  // 뉴트럴
  dark: '#1B1C1E',
  white: '#FFFFFF',
  lightGray: '#F1F2F3',
  border: '#EAEBEC'
}
```

### 3.2 키워드 색상 할당 로직
```javascript
// 백엔드에서 자동 할당
keywords.map((keyword, index) => ({
  text: keyword,
  color: ['blue', 'purple', 'yellow'][index % 3]
}))
```

---

## 4. 공고 생성 폼

### 4.1 필수 필드
```typescript
POST /api/logs

{
  "date": "2024-03-15",        // YYYY-MM-DD
  "project": "project_id",     // 기존 ID or 새 이름
  "title": "공고 제목",
  "content": "공고 내용...",
  "period": "서류 준비"        // 고정 3가지 값
}
```

### 4.2 진행 상태 (고정값)
```typescript
enum Period {
  PREPARE = "서류 준비",
  DOCS_PASSED = "서류 합격",
  INTERVIEW_PASSED = "면접 합격"
}
```

### 4.3 AI 키워드 추출
```typescript
POST /api/ai/extract-keywords

Request:
{
  "content": "공고 내용..."
}

Response:
{
  "success": true,
  "data": {
    "keywords": [
      { "text": "팀워크", "color": "blue" },
      { "text": "문제해결", "color": "purple" },
      { "text": "React", "color": "yellow" },
      { "text": "프론트엔드", "color": "blue" }
    ],
    "suggestedTags": [
      { "text": "협업", "bgColor": "#DDF3EB", "textColor": "#186D50" },
      { "text": "개발", "bgColor": "#DDF3EB", "textColor": "#186D50" }
    ]
  }
}
```

---

## 5. 대시보드 섹션

### 5.1 헤더
```typescript
GET /api/dashboard/header

{
  "success": true,
  "data": {
    "title": "내 공고",
    "actions": [
      {
        "type": "button",
        "label": "내 정보 가져오기",
        "style": "secondary"
      },
      {
        "type": "link",
        "label": "+ 새 공고",
        "href": "/dashboard/logs/new",
        "style": "primary"
      }
    ]
  }
}
```

### 5.2 진행중인 공고
```typescript
GET /api/logs?status=active&sort=recent&limit=8
```

### 5.3 모든 공고 (리스트 뷰)
```typescript
GET /api/logs?view=list&limit=20

// 리스트 아이템 구조
interface LogListItem {
  id: string
  date: string              // "2024 상반기"
  project: string           // "서버랩 D-1"
  projectBadgeColor: string // "#25A778"
  title: string
  period: string            // "서류 준비"
}
```

---

## 6. 프로젝트 선택

### 6.1 드롭다운용 간단 목록
```typescript
GET /api/projects/simple-list

{
  "success": true,
  "data": [
    { "id": "project_1", "name": "서버랩 D-1" },
    { "id": "project_2", "name": "2차 면접 D-2" },
    { "id": "project_3", "name": "1차 면접 D-9" }
  ]
}
```

---

## 7. 인증 페이지

### 7.1 로그인
```typescript
POST /api/auth/login

Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt_token"
  },
  "message": "로그인되었습니다"  // 토스트에 표시
}
```

### 7.2 회원가입
```typescript
POST /api/auth/register

Request:
{
  "name": "홍길동",
  "email": "user@example.com",
  "password": "password123",
  "university": "서울대학교",
  "major": "컴퓨터공학과"
}

Response:
{
  "success": true,
  "data": { ... },
  "message": "회원가입이 완료되었습니다"
}
```

---

## 8. 카드 액션

### 8.1 메뉴 (⋮ 버튼)
```typescript
PATCH /api/logs/:id     // 수정
DELETE /api/logs/:id    // 삭제
POST /api/logs/:id/duplicate  // 복제
```

---

## 9. 에러 처리

### 9.1 사용자 친화적 메시지
```typescript
// 성공
{
  "success": true,
  "message": "공고가 생성되었습니다"
}

// 에러
{
  "success": false,
  "error": "이미 존재하는 공고입니다",
  "code": "DUPLICATE_LOG"
}
```

### 9.2 한국어 에러 메시지 필수
- "이메일 형식이 올바르지 않습니다"
- "비밀번호는 8자 이상이어야 합니다"
- "공고를 찾을 수 없습니다"
- "권한이 없습니다"

---

## 10. 라우팅 매핑

### 10.1 Next.js App Router ↔ Backend API
```
/                          → 정적 (랜딩 페이지)
/auth/login                → POST /api/auth/login
/auth/register             → POST /api/auth/register
/dashboard                 → GET /api/logs, GET /api/dashboard/stats
/dashboard/logs/new        → POST /api/logs, POST /api/ai/extract-keywords
/dashboard/projects        → GET /api/projects (미구현)
/dashboard/keywords        → GET /api/keywords (미구현)
/dashboard/portfolio       → GET /api/portfolios (미구현)
/dashboard/profile         → GET /api/users/me (미구현)
```

---

## 11. 반응형 고려사항

### 11.1 그리드 브레이크포인트
```typescript
// Tailwind 클래스 기준
grid-cols-1              // 모바일: 1열
md:grid-cols-2          // 태블릿: 2열
lg:grid-cols-3          // 노트북: 3열
xl:grid-cols-4          // 데스크톱: 4열
```

### 11.2 페이지네이션 limit
```typescript
GET /api/logs?limit=4   // 모바일
GET /api/logs?limit=8   // 태블릿
GET /api/logs?limit=12  // 데스크톱
```

---

## 12. Phase 별 우선순위

### Phase 1 (즉시 필요 - MVP)
1. ✅ 회원가입/로그인
2. ✅ 공고 CRUD
3. ✅ 대시보드 카드 그리드
4. ✅ AI 키워드 추출
5. ✅ 프로젝트 간단 목록

### Phase 2 (1-2주 내)
6. ⏳ 검색 기능 (사이드바)
7. ⏳ 프로젝트 상세 관리
8. ⏳ 프로필 수정
9. ⏳ 알림 기능

### Phase 3 (1개월 내)
10. ⏳ 포트폴리오 생성
11. ⏳ 키워드 관리
12. ⏳ 동료 인증

---

## 13. 프론트엔드 상태 관리

### 13.1 TanStack Query 예시
```typescript
// 공고 목록
const { data, isLoading } = useQuery({
  queryKey: ['logs', 'active'],
  queryFn: () => axios.get('/api/logs?status=active')
})

// 공고 생성
const createLog = useMutation({
  mutationFn: (data) => axios.post('/api/logs', data),
  onSuccess: () => {
    queryClient.invalidateQueries(['logs'])
    toast.success('공고가 생성되었습니다')
  }
})
```

---

## 14. 실시간 기능 (선택 - Phase 2)

### 14.1 Server-Sent Events
```typescript
GET /api/ai/extract-keywords/stream

data: {"type": "progress", "percent": 30}
data: {"type": "progress", "percent": 60}
data: {"type": "complete", "keywords": [...]}
```

---

## 15. 디자인 일관성 체크리스트

### 15.1 백엔드에서 반드시 지킬 것
- ✅ 모든 색상은 BBOGAK 팔레트 사용
- ✅ 키워드는 3색 로테이션 (blue → purple → yellow)
- ✅ 프로젝트 배지는 항상 초록색 (#25A778)
- ✅ 날짜 배지는 연한 초록 배경 (#DDF3EB)
- ✅ 에러 메시지는 한국어
- ✅ 날짜 형식은 ISO 8601 (YYYY-MM-DD)

---

## 16. API 성능 최적화

### 16.1 캐싱
```typescript
// Redis 캐싱 (5분)
GET /api/projects/simple-list    // 자주 변경 안됨
GET /api/keywords/master-list    // 자주 변경 안됨

// 캐싱 안함
GET /api/logs                    // 실시간 데이터
POST /api/logs                   // 쓰기 작업
```

### 16.2 페이지네이션
```typescript
// Cursor-based (추천)
GET /api/logs?cursor=log_123&limit=20

// Offset-based (간단)
GET /api/logs?page=1&limit=20
```

---

## 17. 보안 체크리스트

### 17.1 필수 구현
- ✅ JWT 토큰 검증 (모든 보호된 라우트)
- ✅ CORS 설정 (프론트엔드 도메인만 허용)
- ✅ Rate Limiting (분당 60회)
- ✅ XSS 방지 (입력값 검증)
- ✅ SQL Injection 방지 (Prisma ORM)
- ✅ 비밀번호 해싱 (bcrypt)
- ✅ HTTPS 필수 (프로덕션)

---

## 18. 환경 변수

### 18.1 프론트엔드 (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_ENV=development
```

### 18.2 백엔드 (.env)
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-...
```

---

## 19. 배포 체크리스트

### 19.1 프론트엔드 (Vercel)
- ✅ 환경 변수 설정
- ✅ Build 성공 확인
- ✅ 도메인 연결

### 19.2 백엔드 (Railway/Render)
- ✅ 환경 변수 설정
- ✅ 데이터베이스 연결
- ✅ CORS 설정
- ✅ 헬스 체크 엔드포인트

---

**작성자**: PROOF 팀  
**업데이트**: 2024년 11월 14일
