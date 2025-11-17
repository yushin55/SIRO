# ProoF 프로젝트 개요

## 📱 프로젝트 소개

**ProoF (Proof of Process)** - 경험을 증명으로, 과정을 역량으로

상경계열 대학생의 짧은 경험 로그를 AI로 분석해, 검증된 역량 키워드와 과정 중심 포트폴리오를 생성하는 커리어 플랫폼입니다.

---

## 🎯 핵심 가치

### 학생에게
"회고를 못 쓰는 사람도, 말만 하면 정리되는 AI 회고/포트폴리오"

### HR에게
"결과가 아니라 과정과 증거까지 함께 보는 신규 평가 데이터"

---

## 🏗️ 프로젝트 구조

```
front/
├── index.html                    # 랜딩 페이지 (첫 화면)
├── styles.css
├── script.js
├── docs/
│   ├── prd.md                    # 기획서
│   ├── tech-stack.md             # 기술 스택 문서
│   └── backend-requirements.md   # 백엔드 API 요구사항
└── flutter_app/                  # Flutter 앱 (메인 애플리케이션)
    ├── lib/
    │   ├── main.dart
    │   ├── screens/              # 화면들
    │   ├── widgets/              # 위젯들
    │   ├── models/               # 데이터 모델
    │   ├── services/             # API 서비스
    │   └── utils/                # 유틸리티
    ├── pubspec.yaml
    └── README.md
```

---

## 🚀 시작하기

### 1. 랜딩 페이지 보기
```bash
# index.html 파일을 브라우저에서 열기
```
랜딩 페이지는 서비스 소개 및 마케팅용입니다.

### 2. Flutter 앱 실행

#### 사전 요구사항
- Flutter SDK 3.16+
- Dart 3.2+
- Android Studio / Xcode (모바일 개발 시)
- VS Code 또는 Android Studio

#### 설치 및 실행
```bash
# Flutter 앱 디렉토리로 이동
cd flutter_app

# 의존성 설치
flutter pub get

# 앱 실행 (디바이스 선택)
flutter run

# 또는 특정 플랫폼 지정
flutter run -d chrome        # 웹
flutter run -d windows       # Windows
flutter run -d android       # Android
```

---

## 📋 주요 기능

### 1. AI Ghostwriter
- 짧은 메모 → 구조화된 회고 자동 생성
- 역량 키워드 자동 추출
- 컨텍스트 기반 추천

### 2. 프로젝트 타임라인
- 로그를 프로젝트 단위로 자동 그룹핑
- 시간순 타임라인 뷰
- 프로젝트 요약 AI 생성

### 3. 3-Level 역량 검증
- **Lv.1** Self-Claimed: 본인 태그
- **Lv.2** Peer-Endorsed: 동료 인증
- **Lv.3** Verified: 증명서 기반

### 4. 과정 중심 포트폴리오
- 직무별 맞춤 포트폴리오
- PDF/웹 페이지 생성
- 증거 자료 포함

### 5. HR 리포트 (Phase 2-3)
- 인재 검색
- 역량 기반 필터링
- 프로세스 중심 평가

---

## 🛠️ 기술 스택

### 프론트엔드
- **Flutter 3.16+** - 크로스 플랫폼 UI
- **Riverpod** - 상태 관리
- **Go Router** - 라우팅
- **Dio** - HTTP 클라이언트
- **Hive** - 로컬 저장소

### 백엔드 (계획)
- **Node.js + TypeScript**
- **Express** - 웹 프레임워크
- **Prisma** - ORM
- **PostgreSQL** - 데이터베이스
- **Redis** - 캐싱

### AI
- **OpenAI GPT-4 Turbo** - 회고 생성
- **Google Vision API** - OCR

### 인프라
- **Vercel/Railway** - 백엔드 호스팅
- **Supabase** - PostgreSQL + Storage
- **Firebase** - 푸시 알림

---

## 📱 화면 구조

### 인증
1. **Splash** - 스플래시 화면
2. **Login** - 로그인
3. **Register** - 회원가입

### 메인 (Bottom Navigation)
1. **Home** - 대시보드
   - 오늘의 로그 입력
   - 최근 활동 요약
   - AI 제안
   
2. **Projects** - 프로젝트 관리
   - 프로젝트 리스트
   - 프로젝트 상세
   - 타임라인
   
3. **Keywords** - 역량 보드
   - 키워드 카드
   - 레벨별 필터
   - 성장 추적
   
4. **Portfolio** - 포트폴리오
   - 포트폴리오 생성
   - PDF 다운로드
   - 공유 링크
   
5. **Profile** - 내 정보
   - 프로필 수정
   - 설정
   - 알림

### 추가 화면
- **Log Entry** - 로그 작성 (Modal)
- **Project Detail** - 프로젝트 상세
- **Keyword Detail** - 역량 상세

---

## 📚 문서

### 기획 문서
- **docs/prd.md** - 전체 서비스 기획서
  - 서비스 개요
  - 타깃 & 페르소나
  - 핵심 기능 정의
  - 화면별 요구사항
  - 데이터 구조
  - 개발 로드맵

### 기술 문서
- **docs/tech-stack.md** - 기술 스택 상세
  - 프론트엔드 스택
  - 백엔드 스택
  - 인프라
  - 디자인 시스템
  - 보안 요구사항

- **docs/backend-requirements.md** - API 명세서
  - RESTful API 엔드포인트
  - 요청/응답 형식
  - 인증 방식
  - 에러 코드
  - 데이터베이스 스키마

---

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary**: #6C63FF (보라색)
- **Secondary**: #FF6B9D (핑크)
- **Accent**: #FFB84D, #4ECDC4, #A8E6CF

### Level Colors
- **Lv.1**: #FFE5B4 (Self-Claimed)
- **Lv.2**: #B4D7FF (Peer-Endorsed)
- **Lv.3**: #FFB4D7 (Verified)

### 디자인 원칙
- 부드러운 곡선 (12~32px radius)
- 카드 기반 레이아웃
- 파스텔 톤
- 부드러운 애니메이션
- 반응형 디자인

---

## 🗓️ 개발 로드맵

### MVP (0~3개월) - 현재 단계
- [x] 프로젝트 구조 설정
- [x] 디자인 시스템
- [x] 기본 화면 구현
- [ ] 회원가입/로그인
- [ ] 로그 입력
- [ ] AI 회고 생성
- [ ] 프로젝트 기본 그룹핑
- [ ] 키워드 Lv.1 관리

### v1 (3~6개월)
- [ ] 키워드 Lv.2 동료 인증
- [ ] 역량 보드 화면
- [ ] 프로젝트 타임라인 UI
- [ ] 푸시 알림

### v2 (6~12개월)
- [ ] PDF 업로드 + OCR
- [ ] Lv.3 자동 업그레이드
- [ ] 포트폴리오 생성
- [ ] HR 리포트 뷰

### v3 (1년+)
- [ ] HR 검색 대시보드
- [ ] 채용 공고 연동
- [ ] 활동 추천/매칭

---

## 🤝 기여하기

### Git Workflow
```bash
# 새 기능 브랜치
git checkout -b feature/기능명

# 커밋
git add .
git commit -m "feat: 기능 설명"

# 푸시
git push origin feature/기능명
```

### 커밋 컨벤션
- `feat`: 새 기능
- `fix`: 버그 수정
- `docs`: 문서
- `style`: 포맷팅
- `refactor`: 리팩토링
- `test`: 테스트
- `chore`: 빌드/설정

---

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 생성해주세요.

---

## 📄 라이센스

MIT License

---

## 🎯 다음 단계

1. **백엔드 개발** - API 서버 구축
2. **AI 통합** - OpenAI API 연동
3. **상태 관리** - Riverpod 통합
4. **화면 완성** - 남은 화면들 구현
5. **테스트** - 단위/통합 테스트
6. **배포** - 스토어 출시 준비

---

**2025년 11월 13일 작성**
