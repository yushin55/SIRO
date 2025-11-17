# ProoF - 경험을 증명으로, 과정을 역량으로

![ProoF Logo](https://via.placeholder.com/800x200/6C63FF/FFFFFF?text=ProoF)

> 상경계열 대학생의 짧은 경험 로그를 AI로 분석해, 검증된 역량 키워드와 과정 중심 포트폴리오를 생성하는 커리어 플랫폼

---

## 🎯 프로젝트 소개

**ProoF (Proof of Process)**는 대학생들이 일상의 경험을 쉽게 기록하고, AI가 이를 구조화된 회고와 검증된 역량으로 변환해주는 혁신적인 커리어 관리 플랫폼입니다.

### 핵심 가치
- **학생에게**: 회고를 못 쓰는 사람도, 말만 하면 정리되는 AI 회고/포트폴리오
- **HR에게**: 결과가 아니라 과정과 증거까지 함께 보는 신규 평가 데이터

---

## ✨ 주요 기능

### 🤖 AI Ghostwriter
짧은 메모만 입력하면 AI가 자동으로 구조화된 회고와 역량 키워드를 생성합니다.

```
입력: "오늘 학회 회의에서 데이터 분석안 다 갈아엎음... #힘듦 #전략기획"

AI 출력: 
"초기 데이터 분석 결과 X 가설이 틀렸음을 발견하고, Y 방향으로 피봇을 제안함.
그 과정에서 팀원 설득과 자료 재정리가 필요했음."
+ 키워드: #기획력, #문제정의, #데이터분석
```

### 📊 프로젝트 타임라인
여러 날의 로그를 프로젝트 단위로 자동 그룹핑하여 시간순으로 보여줍니다.

### ⭐ 3-Level 역량 검증 시스템
- **Lv.1 Self-Claimed**: 본인이 직접 태그
- **Lv.2 Peer-Endorsed**: 팀원이 인증
- **Lv.3 Verified**: 증명서로 검증 (OCR 자동 인식)

### 📄 과정 중심 포트폴리오
직무별 맞춤 포트폴리오를 AI가 자동 구성하고 PDF로 다운로드할 수 있습니다.

---

## 🏗️ 프로젝트 구조

```
front/
├── index.html                     # 랜딩 페이지 (서비스 소개)
├── styles.css
├── script.js
│
├── docs/                          # 문서
│   ├── prd.md                     # 제품 기획서
│   ├── tech-stack.md              # 기술 스택
│   ├── backend-requirements.md    # 백엔드 API 명세
│   ├── project-overview.md        # 프로젝트 개요
│   └── quick-start.md             # 빠른 시작 가이드
│
└── flutter_app/                   # Flutter 앱 (메인)
    ├── lib/
    │   ├── main.dart              # 앱 진입점
    │   ├── screens/               # 화면
    │   │   ├── splash_screen.dart
    │   │   ├── login_screen.dart
    │   │   ├── register_screen.dart
    │   │   ├── home_screen.dart
    │   │   ├── log_screen.dart
    │   │   └── ...
    │   ├── widgets/               # 재사용 위젯
    │   │   ├── log_card.dart
    │   │   └── quick_stats_card.dart
    │   ├── models/                # 데이터 모델
    │   ├── services/              # API 서비스
    │   └── utils/                 # 유틸리티
    │       ├── app_theme.dart     # 디자인 시스템
    │       └── app_router.dart    # 라우팅
    ├── pubspec.yaml
    └── README.md
```

---

## 🚀 빠른 시작

### 사전 요구사항
- Flutter SDK 3.16+
- Dart 3.2+
- VS Code 또는 Android Studio

### 설치 및 실행

```powershell
# 1. Flutter 앱 디렉토리로 이동
cd flutter_app

# 2. 의존성 설치
flutter pub get

# 3. 앱 실행 (웹)
flutter run -d chrome

# 또는 Windows 앱으로 실행
flutter run -d windows
```

자세한 가이드는 [docs/quick-start.md](docs/quick-start.md)를 참고하세요.

---

## 📱 화면 구성

### 인증 화면
- **Splash** - 스플래시 화면
- **Login** - 로그인
- **Register** - 회원가입

### 메인 화면 (Bottom Navigation)
1. **홈** - 대시보드, 로그 입력, AI 제안
2. **프로젝트** - 프로젝트 관리 및 타임라인
3. **역량** - 키워드 보드 및 성장 추적
4. **포트폴리오** - 포트폴리오 생성 및 관리
5. **내 정보** - 프로필 및 설정

---

## 🛠️ 기술 스택

### 프론트엔드 (Flutter)
```yaml
- Flutter 3.16+
- Riverpod (상태 관리)
- Go Router (라우팅)
- Dio (HTTP 클라이언트)
- Hive (로컬 저장소)
- Google Fonts (폰트)
```

### 백엔드 (계획)
```yaml
- Node.js + TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Redis
- OpenAI API (GPT-4)
```

### 인프라
```yaml
- Vercel/Railway (백엔드)
- Supabase (DB + Storage)
- Firebase (푸시 알림)
- Cloudflare (CDN)
```

전체 기술 스택: [docs/tech-stack.md](docs/tech-stack.md)

---

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary**: `#6C63FF` (보라색)
- **Secondary**: `#FF6B9D` (핑크)
- **Accent**: `#FFB84D`, `#4ECDC4`, `#A8E6CF`

### Level Colors
- **Lv.1**: `#FFE5B4` (Self-Claimed)
- **Lv.2**: `#B4D7FF` (Peer-Endorsed)
- **Lv.3**: `#FFB4D7` (Verified)

### 디자인 원칙
- 부드러운 곡선 (12~32px border-radius)
- 카드 기반 레이아웃
- 파스텔 톤 컬러
- 부드러운 애니메이션
- 반응형 디자인

### 영감 받은 디자인
- **뽀각** - 파스텔 톤, 큰 radius, 플로팅 카드
- **Layer 회고** - 깔끔한 레이아웃, 인터랙티브 UX

---

## 📚 문서

| 문서 | 설명 |
|------|------|
| [PRD](docs/prd.md) | 제품 기획서 (기능, 화면, 데이터 구조) |
| [Tech Stack](docs/tech-stack.md) | 기술 스택 상세 정보 |
| [Backend API](docs/backend-requirements.md) | 백엔드 API 명세서 |
| [Project Overview](docs/project-overview.md) | 프로젝트 전체 개요 |
| [Quick Start](docs/quick-start.md) | 5분 안에 시작하기 |
| [Flutter README](flutter_app/README.md) | Flutter 앱 가이드 |

---

## 🗓️ 개발 로드맵

### ✅ MVP (0~3개월) - 현재
- [x] 프로젝트 구조 설정
- [x] 디자인 시스템 구축
- [x] 기본 화면 구현 (Splash, Login, Register, Home, Log)
- [ ] API 통합
- [ ] AI 회고 생성
- [ ] 로그 CRUD

### 🚧 v1.0 (3~6개월)
- [ ] 프로젝트 관리 기능
- [ ] 동료 인증 (Lv.2)
- [ ] 역량 보드
- [ ] 푸시 알림

### 📋 v2.0 (6~12개월)
- [ ] OCR 증명서 인식 (Lv.3)
- [ ] 포트폴리오 생성기
- [ ] HR 리포트 기본

### 🎯 v3.0 (1년+)
- [ ] HR 검색 대시보드
- [ ] 채용 공고 연동
- [ ] 활동 추천/매칭

---

## 🤝 기여하기

### Git Workflow
```bash
# 새 기능 브랜치
git checkout -b feature/기능명

# 커밋 (Conventional Commits)
git commit -m "feat: 새 기능 추가"
git commit -m "fix: 버그 수정"
git commit -m "docs: 문서 업데이트"

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

## 📊 프로젝트 현황

### 구현 완료 ✅
- 프로젝트 구조 및 설정
- 디자인 시스템 (테마, 컬러, 타이포그래피)
- 라우팅 시스템 (Go Router)
- 스플래시, 로그인, 회원가입 화면
- 홈 화면 (대시보드 UI)
- 로그 작성 화면 (AI Ghostwriter UI)
- 재사용 위젯 (LogCard, QuickStatsCard)
- 문서화 (PRD, 기술스택, API 명세)

### 진행 중 🚧
- API 통합
- 상태 관리 (Riverpod)
- 나머지 화면 구현

### 계획 중 📋
- 백엔드 개발
- AI 통합
- 테스트 작성
- 스토어 출시

---

## 🐛 알려진 이슈

현재 알려진 이슈가 없습니다. 버그를 발견하셨다면 [Issues](../../issues)에 등록해주세요.

---

## 📞 문의

- **이슈**: [GitHub Issues](../../issues)
- **문서**: [docs/](docs/)
- **라이센스**: MIT License

---

## 🎓 학습 자료

### Flutter
- [Flutter 공식 문서](https://flutter.dev/docs)
- [Flutter Cookbook](https://flutter.dev/docs/cookbook)
- [Flutter Widget Catalog](https://flutter.dev/docs/development/ui/widgets)

### Riverpod
- [Riverpod 공식 문서](https://riverpod.dev)
- [Riverpod 튜토리얼](https://codewithandrea.com/articles/flutter-state-management-riverpod/)

### Go Router
- [Go Router 패키지](https://pub.dev/packages/go_router)

---

## 📄 라이센스

MIT License

Copyright (c) 2025 ProoF

---

## 🙏 감사의 말

이 프로젝트는 다음의 영감을 받았습니다:
- **뽀각** - 아름다운 UI/UX 디자인
- **Layer** - 회고 서비스 UX 패턴

---

**Made with ❤️ by ProoF Team**

**2025년 11월 13일**

---

## 🔥 시작해보세요!

```powershell
cd flutter_app
flutter pub get
flutter run -d chrome
```

더 자세한 가이드는 [docs/quick-start.md](docs/quick-start.md)를 확인하세요! 🚀
