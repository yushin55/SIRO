# ProoF 프로젝트 빠른 시작 가이드

## 🚀 5분 안에 시작하기

### 1단계: 랜딩 페이지 확인 (선택사항)

웹 브라우저에서 `index.html` 파일을 열어 랜딩 페이지를 확인하세요.

```bash
# Windows에서 파일 탐색기로 index.html 더블클릭
# 또는 브라우저에서 직접 열기
```

이 페이지는 서비스 소개용입니다. 실제 앱은 Flutter로 개발됩니다.

---

### 2단계: Flutter 앱 실행

#### Flutter 설치 확인
```powershell
flutter doctor
```

모든 항목이 체크되어야 합니다. 문제가 있다면 [Flutter 공식 설치 가이드](https://flutter.dev/docs/get-started/install/windows)를 참고하세요.

#### 앱 실행
```powershell
# 프로젝트 디렉토리로 이동
cd flutter_app

# 의존성 설치
flutter pub get

# 웹에서 실행 (가장 빠름)
flutter run -d chrome

# 또는 Windows 앱으로 실행
flutter run -d windows
```

---

## 📱 앱 구조 이해하기

### 메인 화면 (Bottom Navigation)
1. **홈** - 대시보드와 로그 입력
2. **프로젝트** - 프로젝트 관리
3. **역량** - 키워드 보드
4. **포트폴리오** - 포트폴리오 생성
5. **내 정보** - 프로필 및 설정

### 주요 기능
- **+ 로그 작성** 버튼 → AI가 회고 생성
- 프로젝트별 타임라인 뷰
- 3단계 역량 검증 (Lv.1~3)
- 포트폴리오 PDF 생성

---

## 🎨 디자인 참고

### Layer 회고 서비스 스타일
- 깔끔한 카드 레이아웃
- 부드러운 그라데이션
- 인터랙티브한 애니메이션
- 직관적인 UX

### 뽀각 앱 스타일
- 파스텔 컬러 팔레트
- 큰 border-radius (12~32px)
- 그림자 효과로 입체감
- 플로팅 카드

---

## 📝 개발 시작하기

### 새 화면 추가

1. `lib/screens/` 폴더에 새 파일 생성
2. 화면 위젯 작성
3. `lib/utils/app_router.dart`에 라우트 추가

예시:
```dart
// lib/screens/my_screen.dart
import 'package:flutter/material.dart';

class MyScreen extends StatelessWidget {
  const MyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Screen')),
      body: const Center(child: Text('Hello!')),
    );
  }
}

// lib/utils/app_router.dart에 추가
GoRoute(
  path: '/my-screen',
  builder: (context, state) => const MyScreen(),
),
```

### 새 위젯 추가

1. `lib/widgets/` 폴더에 새 파일 생성
2. 재사용 가능한 위젯 작성

예시:
```dart
// lib/widgets/my_card.dart
import 'package:flutter/material.dart';
import '../utils/app_theme.dart';

class MyCard extends StatelessWidget {
  final String title;
  final VoidCallback? onTap;

  const MyCard({super.key, required this.title, this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(AppTheme.spacingMd),
        decoration: BoxDecoration(
          color: AppTheme.bgCard,
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          boxShadow: AppShadows.md,
        ),
        child: Text(title),
      ),
    );
  }
}
```

---

## 🔌 백엔드 연동

### 1. API 서비스 생성
```dart
// lib/services/api_service.dart
import 'package:dio/dio.dart';

class ApiService {
  final Dio _dio = Dio(
    BaseOptions(
      baseUrl: 'https://api.proof.app/v1',
      connectTimeout: const Duration(seconds: 5),
      receiveTimeout: const Duration(seconds: 3),
    ),
  );

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _dio.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
    return response.data;
  }
}
```

### 2. Riverpod Provider 생성
```dart
// lib/providers/auth_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/api_service.dart';

final apiServiceProvider = Provider((ref) => ApiService());

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.read(apiServiceProvider));
});

class AuthNotifier extends StateNotifier<AuthState> {
  final ApiService _apiService;

  AuthNotifier(this._apiService) : super(AuthState.initial());

  Future<void> login(String email, String password) async {
    state = AuthState.loading();
    try {
      final data = await _apiService.login(email, password);
      state = AuthState.authenticated(data['userId']);
    } catch (e) {
      state = AuthState.error(e.toString());
    }
  }
}
```

---

## 🐛 문제 해결

### "flutter: command not found"
```powershell
# Flutter PATH 설정 확인
$env:PATH
# Flutter SDK 경로가 포함되어 있는지 확인
```

### 의존성 충돌
```powershell
flutter clean
flutter pub get
```

### 빌드 오류
```powershell
flutter clean
flutter pub get
flutter pub run build_runner clean
flutter pub run build_runner build --delete-conflicting-outputs
```

### 핫 리로드 안 됨
앱 실행 중:
- `r` - 핫 리로드
- `R` - 전체 재시작
- `q` - 종료

---

## 📚 추가 학습 자료

### Flutter 기초
- [Flutter 공식 튜토리얼](https://flutter.dev/docs/get-started/codelab)
- [Flutter Widget Catalog](https://flutter.dev/docs/development/ui/widgets)

### 상태 관리 (Riverpod)
- [Riverpod 공식 문서](https://riverpod.dev)
- [Riverpod 예제](https://github.com/rrousselGit/riverpod/tree/master/examples)

### 라우팅 (Go Router)
- [Go Router 가이드](https://pub.dev/packages/go_router)

---

## 💡 팁

### 개발 속도 향상
```powershell
# 코드 변경 시 자동 빌드
flutter pub run build_runner watch
```

### 코드 스니펫 활용
VS Code에서:
- `stless` → StatelessWidget 생성
- `stful` → StatefulWidget 생성
- `build` → build 메서드

### 디버깅
```dart
// 로그 출력
print('Debug: $variable');

// 브레이크포인트
debugger(); // 여기서 멈춤
```

---

## 🎯 다음에 할 일

1. ✅ 프로젝트 구조 이해
2. ✅ Flutter 앱 실행
3. [ ] 로그인 화면에 API 연동
4. [ ] 홈 화면 데이터 연동
5. [ ] 로그 작성 AI 통합
6. [ ] 프로젝트 화면 완성
7. [ ] 역량 보드 구현
8. [ ] 포트폴리오 생성 기능

---

## 🆘 도움이 필요하신가요?

- **docs/prd.md** - 전체 기획서
- **docs/tech-stack.md** - 기술 스택 상세
- **docs/backend-requirements.md** - API 명세서
- **flutter_app/README.md** - Flutter 앱 가이드

---

**Happy Coding! 🚀**

2025년 11월 13일
