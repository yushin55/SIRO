# PROOF UI 설계 명세서

> 본 문서는 PROOF 서비스의 모든 UI 요소, 컴포넌트, 페이지 레이아웃을 체계적으로 정리한 화면 설계 명세서입니다.

## 목차
- [1. 디자인 시스템](#1-디자인-시스템)
- [2. 페이지별 UI 명세](#2-페이지별-ui-명세)
- [3. 컴포넌트 명세](#3-컴포넌트-명세)
- [4. 인터랙션 패턴](#4-인터랙션-패턴)

---

## 1. 디자인 시스템

### 1.1 색상 팔레트

#### Primary Colors
- **Main Green**: `#25A778` (버튼, 강조, CTA)
- **Light Green**: `#2DC98E` (hover 상태)
- **Dark Green**: `#186D50` (텍스트 강조)
- **Pale Green**: `#DDF3EB` (배경, 카드)

#### Secondary Colors
- **Blue**: `#418CC3` (정보성 요소)
- **Light Blue**: `#E8F1FF` (배경)
- **Purple**: `#9C6BB3` (포인트)
- **Light Purple**: `#F0E8FF` (배경)
- **Orange**: `#D77B0F` (경고, 주의)
- **Yellow**: `#FFF3C2` (하이라이트)
- **Red**: `#DC2626` (오류, 삭제)

#### Grayscale
- **Black**: `#1B1C1E` (주요 텍스트)
- **Dark Gray**: `#6B6D70` (보조 텍스트)
- **Medium Gray**: `#CACBCC` (비활성 요소)
- **Light Gray**: `#EAEBEC` (테두리)
- **Pale Gray**: `#F1F2F3` (배경)
- **White**: `#FFFFFF` (카드, 모달)

### 1.2 타이포그래피

#### Font Family
- System Font: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

#### Font Sizes
- **3xl**: `30px` (페이지 제목)
- **2xl**: `24px` (섹션 제목)
- **xl**: `20px` (카드 제목)
- **lg**: `18px` (본문 강조)
- **base**: `16px` (기본 본문)
- **sm**: `14px` (보조 텍스트)
- **xs**: `12px` (라벨, 메타정보)

#### Font Weights
- **extrabold**: `800` (브랜드 로고)
- **bold**: `700` (제목, 버튼)
- **semibold**: `600` (강조 텍스트)
- **medium**: `500` (일반 텍스트)
- **regular**: `400` (본문)

### 1.3 간격 시스템

#### Spacing Scale
- **1**: `4px`
- **2**: `8px`
- **3**: `12px`
- **4**: `16px`
- **5**: `20px`
- **6**: `24px`
- **8**: `32px`
- **10**: `40px`
- **12**: `48px`
- **16**: `64px`

### 1.4 Border Radius
- **sm**: `6px` (작은 태그)
- **md**: `8px` (버튼, 입력창)
- **lg**: `12px` (카드)
- **xl**: `16px` (큰 카드)
- **2xl**: `20px` (모달)
- **3xl**: `24px` (섹션)
- **full**: `9999px` (원형)

### 1.5 Shadow
- **sm**: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- **md**: `0 4px 6px -1px rgb(0 0 0 / 0.1)`
- **lg**: `0 10px 15px -3px rgb(0 0 0 / 0.1)`
- **xl**: `0 20px 25px -5px rgb(0 0 0 / 0.1)`
- **2xl**: `0 25px 50px -12px rgb(0 0 0 / 0.25)`

---

## 2. 페이지별 UI 명세

### 2.1 랜딩 페이지 (`/`)

#### 네비게이션 바
- **위치**: fixed top, 전체 화면 너비
- **배경**: `bg-white/95`, `backdrop-blur-sm`
- **테두리**: `border-b border-[#EAEBEC]`
- **높이**: `py-4` (16px)
- **내부 요소**:
  - 로고: `w-8 h-8`, `bg-[#25A778]`, `rounded-[8px]`
  - 브랜드명: "PROOF", `text-xl font-bold text-[#1B1C1E]`
  - 로그인 버튼: `px-4 py-2`, `text-sm font-medium`
  - 시작하기 버튼: `px-5 py-2`, `bg-[#25A778] text-white`, `rounded-[12px]`

#### Hero Section
- **여백**: `pt-32 pb-20 px-8`
- **제목**: `text-5xl font-extrabold text-[#1B1C1E]`
- **부제**: `text-xl text-[#1B1C1E]/70`
- **CTA 버튼**:
  - 주 버튼: `px-8 py-4`, `bg-[#25A778] text-white`, `rounded-[16px]`
  - 보조 버튼: `px-8 py-4`, `bg-white border-2 border-[#EAEBEC]`, `rounded-[16px]`

#### Features Section
- **배경**: `bg-[#F1F2F3]`
- **여백**: `py-20 px-8`
- **제목**: `text-3xl font-bold`
- **카드 레이아웃**: `grid grid-cols-1 md:grid-cols-3 gap-6`
- **카드 스타일**:
  - 배경: `bg-white`, `rounded-[20px]`, `p-8`
  - 테두리: `border border-[#EAEBEC]`
  - 아이콘 영역: `w-12 h-12`, 색상별 배경 (그라데이션)
  - 번호 표시: `font-bold text-2xl`

#### How It Works Section
- **배경**: `bg-white`
- **여백**: `py-20 px-8`
- **단계 표시**:
  - 번호 박스: `w-12 h-12`, 색상별 그라데이션, `rounded-[12px]`
  - 제목: `text-xl font-bold`
  - 설명: `text-[#1B1C1E]/70`

#### CTA Section
- **배경**: `bg-[#25A778]`
- **여백**: `py-20 px-8`
- **제목**: `text-4xl font-bold text-white`
- **버튼**: `px-10 py-4`, `bg-white text-[#25A778]`, `rounded-[16px]`

#### Footer
- **배경**: `bg-[#1B1C1E]`
- **여백**: `py-12 px-8`
- **텍스트**: `text-white/50 text-sm`

---

### 2.2 로그인 페이지 (`/auth/login`)

#### 레이아웃
- **배경**: `bg-[#F1F2F3]`, `min-h-screen`
- **중앙 정렬**: `flex items-center justify-center`
- **카드**: `max-w-md`, `bg-white`, `rounded-[24px]`, `p-8`

#### 로고 섹션
- **아이콘**: `w-12 h-12`, `bg-[#25A778]`, `rounded-[12px]`
- **제목**: `text-2xl font-bold text-[#1B1C1E]`
- **설명**: `text-sm text-[#1B1C1E]/60`

#### 폼 요소
- **레이블**: `text-sm font-bold text-[#1B1C1E]`
- **입력창**: `input-field` 클래스
  - `w-full px-4 py-3`
  - `border-2 border-[#EAEBEC]`
  - `rounded-[12px]`
  - `focus:border-[#25A778] focus:outline-none`
- **비밀번호 표시 버튼**: `absolute right-4 top-1/2 -translate-y-1/2`

#### 제출 버튼
- **스타일**: `w-full px-6 py-3.5`
- **배경**: `bg-[#25A778] text-white`
- **형태**: `rounded-[16px]`
- **비활성화**: `disabled:opacity-50 disabled:cursor-not-allowed`

#### 링크
- **스타일**: `text-sm text-[#1B1C1E]/60`
- **강조**: `text-[#25A778] font-bold`

---

### 2.3 회원가입 페이지 (`/auth/register`)

#### 구조
- 로그인 페이지와 유사한 레이아웃
- 추가 입력 필드:
  - 이름
  - 비밀번호 확인
  - 대학교 (선택)
  - 전공 (선택)

#### 폼 요소
- **필수 표시**: `<span className="text-[#DC2626]">*</span>`
- **입력창 간격**: `space-y-4`
- **버튼 여백**: `mt-6`

---

### 2.4 대시보드 메인 (`/dashboard`)

#### 레이아웃
- **사이드바**: 좌측 고정, `w-[240px]`, `bg-[#1B1C1E]`
- **메인 컨텐츠**: 우측, `ml-[240px]`, `bg-[#F1F2F3]`

#### 헤더
- **배경**: `bg-white`
- **여백**: `px-8 py-6`
- **제목**: `text-2xl font-bold`
- **버튼**:
  - 보조: `px-4 py-2 bg-white border border-[#EAEBEC] rounded-[12px]`
  - 주요: `px-4 py-2 bg-[#25A778] text-white rounded-[12px]`

#### 공고 카드 그리드
- **레이아웃**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`
- **카드 스타일**:
  - 배경: `bg-white`, `rounded-[16px]`, `p-5`
  - 테두리: `border border-[#EAEBEC]`
  - Hover: `hover:border-[#25A778]`

#### 카드 내부 요소
- **프로젝트 뱃지**: `w-2 h-2 bg-[#25A778] rounded-[2px]`
- **날짜 뱃지**: `px-2.5 py-1 bg-[#DDF3EB] text-[#186D50] rounded-[6px] text-xs font-bold`
- **제목**: `font-bold text-sm`, `line-clamp-2 min-h-[40px]`
- **키워드 태그**: 색상별 배경 + 텍스트
  - Blue: `bg-[#E8F1FF] text-[#418CC3]`
  - Purple: `bg-[#F0E8FF] text-[#9C6BB3]`
  - Yellow: `bg-[#FFF3C2] text-[#D77B0F]`

#### 모든 공고 리스트
- **레이아웃**: `space-y-3`
- **항목 스타일**: `bg-white rounded-[12px] px-5 py-4`
- **정보 배치**: `flex items-center justify-between`

---

### 2.5 대시보드 레이아웃 (`/dashboard/layout`)

#### 사이드바
- **배경**: `bg-[#1B1C1E] text-white`
- **너비**: `w-[240px]`
- **위치**: `fixed h-full`

#### 로고 영역
- **여백**: `p-6`
- **아이콘**: `w-10 h-10 bg-[#25A778] rounded-[12px]`

#### 네비게이션
- **상단 메뉴** (내 정보, 검색, 알림):
  - 여백: `px-4 space-y-2`
  - 항목: `flex items-center gap-3 px-3 py-2`
  - 색상: `text-white/70 hover:text-white`
  - Hover: `hover:bg-white/5 rounded-[8px]`

#### 주요 메뉴
- **활성 상태**: `bg-[#25A778] text-white font-bold`
- **비활성 상태**: `text-white/70 hover:text-white hover:bg-white/5`
- **아이콘**: `w-4 h-4`
- **텍스트**: `text-sm`

#### 하단 영역
- **테두리**: `border-t border-white/10`
- **버튼**: `w-full px-3 py-2 text-sm text-white/70 hover:text-white`

---

### 2.6 회고 페이지 (`/dashboard/reflections`)

#### 헤더
- **제목**: `text-3xl font-bold text-[#1B1C1E]`
- **설명**: `text-[#6B6D70]`
- **버튼**: `btn-primary flex items-center gap-2`

#### Baseline 설정 알림
- **배경**: `bg-gradient-to-r from-[#DDF3EB] to-[#E8F1FF]`
- **테두리**: `border-2 border-[#25A778]/30`
- **여백**: `rounded-xl p-6`
- **아이콘**: `w-12 h-12 bg-white rounded-xl`

#### 통계 카드
- **레이아웃**: `grid grid-cols-1 lg:grid-cols-3 gap-6`
- **카드**: `bg-white`, `rounded-[16px]`, `p-6` (card 클래스)
- **아이콘**: `w-5 h-5` (색상별)
- **숫자**: `text-3xl font-bold`
- **설명**: `text-sm text-[#6B6D70]`

#### 빠른 액션 카드
- **레이아웃**: `grid grid-cols-1 md:grid-cols-2 gap-4`
- **스타일**: `card hover:shadow-lg transition-all cursor-pointer`
- **배경**: `bg-gradient-to-br from-white to-[color]`
- **아이콘 영역**: `w-12 h-12 bg-[color] rounded-xl`

#### 최근 기록 리스트
- **빈 상태**:
  - 아이콘: `w-16 h-16 bg-[#F8F9FA] rounded-2xl`
  - 메시지: `text-[#6B6D70]`
  - 버튼: `btn-primary`
- **항목**:
  - 배경: `bg-[#F8F9FA] rounded-xl`
  - Hover: `hover:bg-white border-2 border-transparent hover:border-[#EAEBEC]`
  - 레이아웃: `flex items-start gap-4`

---

### 2.7 회고 홈 (`/dashboard/reflection-home`)

#### 빠른 액션 카드
- **레이아웃**: `grid grid-cols-1 md:grid-cols-3 gap-4`
- **카드 스타일**: `card hover:shadow-lg transition-all group`
- **아이콘**: `w-14 h-14`, 색상별 배경, `rounded-xl`
- **Hover 효과**: `group-hover:bg-[color]`

#### 성장 통계
- **레이아웃**: `grid grid-cols-1 md:grid-cols-4 gap-4`
- **카드**: `bg-white`, `rounded-[16px]`, `p-6`
- **레이블**: `text-sm text-[#6B6D70]`
- **숫자**: `text-3xl font-bold`
- **추가 정보**: `text-sm` (색상별)

#### 최근 회고 카드
- **스타일**: `card hover:shadow-lg transition-all cursor-pointer`
- **뱃지**: `px-3 py-1 rounded-full text-xs font-medium`
- **날짜**: `text-xs text-[#6B6D70]`
- **내용**: `text-sm text-[#1B1C1E] line-clamp-2`
- **점수**: `w-12 h-12 bg-[#DDF3EB] rounded-lg`

#### AI 피드백
- **배경**: `bg-[#F1F2F3] p-3 rounded-lg`
- **아이콘**: `w-4 h-4 text-[#25A778]`
- **텍스트**: `text-sm text-[#6B6D70] line-clamp-2`

#### AI 추천 카드
- **배경**: `card border-2 border-[#25A778]/20`
- **아이콘**: `w-10 h-10 bg-[#25A778] rounded-lg`
- **제목**: `font-semibold text-[#1B1C1E]`
- **링크**: `text-sm text-[#25A778] hover:text-[#186D50]`

---

### 2.8 추천 활동 페이지 (`/dashboard/recommendations`)

#### AI 추천 배너
- **배경**: `bg-white border border-[#EAEBEC] rounded-xl p-6`
- **제목**: `text-lg font-bold text-[#1B1C1E]`
- **설명**: `text-sm text-[#6B6D70]`
- **버튼**: `px-6 py-3 bg-[#25A778] text-white rounded-lg`

#### 필터 영역
- **배경**: `card`
- **검색창**: `input-field pl-10` (아이콘 공간)
- **카테고리 탭**: `border-b border-[#EAEBEC]`
  - 활성: `text-[#25A778] font-bold`, `border-b-2 border-[#25A778]`
  - 비활성: `text-[#6B6D70] hover:text-[#1B1C1E]`

#### 분야 버튼
- **활성**: `bg-[#25A778] text-white`
- **비활성**: `bg-white border border-[#EAEBEC] text-[#6B6D70]`
- **형태**: `px-4 py-2 rounded-lg`

#### 정렬 버튼
- **활성**: `bg-[#1B1C1E] text-white`
- **비활성**: `bg-white text-[#6B6D70] border border-[#EAEBEC]`

#### 활동 카드
- **레이아웃**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **카드**: `card hover:shadow-lg transition-all cursor-pointer`
- **이미지 영역**: `w-full h-40 bg-[#F1F2F3] rounded-lg`
- **매칭 점수**: `px-3 py-1 bg-[#25A778] text-white rounded-full text-xs`
- **D-day**: 색상별 (빨강 <= 3일, 주황 <= 7일)
- **북마크**: `w-5 h-5` (활성: `fill-[#25A778]`)

---

### 2.9 스페이스 생성 (`/dashboard/spaces/new`)

#### 프로그레스 바
- **구조**: `flex items-center justify-between`
- **스텝 인디케이터**: `w-8 h-8 rounded-full`
  - 활성: `bg-[#25A778] text-white`
  - 비활성: `bg-[#F1F2F3] text-[#6B6D70]`
- **연결선**: `h-1 bg-[#F1F2F3]`, 활성 시 `bg-[#25A778]`

#### 활동 유형 선택
- **레이아웃**: `grid grid-cols-2 gap-3`
- **버튼**: `p-4 rounded-xl border-2`
  - 선택: `border-[#25A778] bg-[#DDF3EB]`
  - 비선택: `border-[#EAEBEC] bg-white`
- **아이콘**: `w-8 h-8`
- **제목**: `font-semibold text-[#1B1C1E]`
- **설명**: `text-xs text-[#6B6D70]`

#### 기간 입력
- **레이아웃**: `grid grid-cols-2 gap-4`
- **레이블**: `text-xs text-[#6B6D70]`
- **입력창**: `input-field w-full`

#### 회고 주기 선택
- **추천 뱃지**: `px-2 py-0.5 bg-[#25A778] text-white text-xs rounded-full`
- **아이콘**: `w-7 h-7`
- **설명**: `text-xs text-[#6B6D70]`

#### 토글 스위치
- **배경**: `w-12 h-6 rounded-full`
  - ON: `bg-[#25A778]`
  - OFF: `bg-[#CACBCC]`
- **핸들**: `w-5 h-5 bg-white rounded-full shadow`

#### 예상 일정 카드
- **배경**: `card bg-[#F8F9FA]`
- **항목**: `flex items-center justify-between`
- **레이블**: `text-[#6B6D70]`
- **값**: `font-medium` (색상별)

---

### 2.10 챗봇 회고 (`/dashboard/reflections/chatbot`)

#### 전체 레이아웃
- **위치**: `fixed inset-0 z-50`
- **배경**: `bg-[#F8F9FA]`

#### 헤더
- **배경**: `bg-white border-b border-gray-200`
- **여백**: `px-6 py-4`
- **제목**: `font-bold text-gray-800 text-lg`
- **진행 상황**: `text-sm text-gray-500`

#### 메시지 영역
- **배경**: `bg-[#F1F2F3]`
- **여백**: `px-6 py-8 space-y-4`
- **사용자 메시지**:
  - 정렬: `justify-end`
  - 배경: `bg-blue-500 text-white`
  - 형태: `rounded-2xl rounded-br-none`
- **봇 메시지**:
  - 정렬: `justify-start`
  - 배경: `bg-white border border-gray-200`
  - 형태: `rounded-2xl rounded-bl-none`

#### 타이핑 인디케이터
- **구조**: `flex gap-1`
- **점**: `w-2 h-2 bg-gray-400 rounded-full animate-bounce`

#### 입력 영역
- **배경**: `bg-white border-t border-gray-200 shadow-lg`
- **여백**: `px-6 py-4`
- **텍스트 영역**: `flex-1 p-4 border border-gray-300 rounded-xl`
- **전송 버튼**:
  - 활성: `bg-blue-500 text-white`
  - 비활성: `bg-gray-200 text-gray-400`

---

### 2.11 설문 조사 (`/dashboard/reflections/survey`)

#### 배경
- `bg-gradient-to-br from-blue-50 via-white to-purple-50`

#### 프로그레스
- **레이블**: `text-sm font-medium text-gray-600`
- **퍼센트**: `text-sm font-medium text-blue-600`
- **바**: `h-2 bg-gray-200 rounded-full`
  - 진행: `bg-gradient-to-r from-blue-500 to-purple-500`

#### 질문 카드
- **배경**: `bg-white rounded-2xl shadow-lg p-8`
- **제목**: `text-2xl font-bold text-gray-800`
- **옵션**: `space-y-3`
  - 선택: `border-blue-500 bg-blue-50 shadow-md`
  - 비선택: `border-gray-200 hover:border-gray-300`

#### 네비게이션
- **이전 버튼**: `px-6 py-3 bg-white border-2 border-gray-300 rounded-xl`
- **다음 버튼**: `px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl`

---

### 2.12 마이크로 로그 (`/dashboard/reflections/micro`)

#### 진행 표시
- **바**: `h-1 flex-1 rounded-full`
  - 완료: `bg-[#25A778]`
  - 미완료: `bg-[#EAEBEC]`

#### 활동 선택 카드
- **레이아웃**: `grid grid-cols-2 gap-4`
- **스타일**: `p-6 rounded-2xl border-2 hover:scale-105`
- **배경**: `bg-gradient-to-br` (색상별)
- **아이콘**: `text-5xl`
- **제목**: `font-bold text-white text-lg drop-shadow-md`

#### 기분 비교 버튼
- **구조**: `w-full p-4 rounded-xl border-2`
- **이모지**: `text-4xl`
- **텍스트**: `font-medium text-[#1B1C1E]`

#### AI 태그 제안
- **배경**: `bg-[#DDF3EB] rounded-xl p-4 border border-[#25A778]/20`
- **아이콘**: `w-5 h-5 text-[#25A778]`
- **제목**: `font-medium text-[#186D50]`
- **태그**: `px-3 py-1 bg-white/50 rounded-lg text-sm`

---

### 2.13 성장 스토리 (`/dashboard/reflections/story`)

#### 기간 선택
- **레이아웃**: `flex gap-2`
- **버튼**:
  - 활성: `bg-[#25A778] text-white`
  - 비활성: `bg-white text-[#6B6D70]`

#### 인트로 카드
- **배경**: `card bg-gradient-to-br from-[#DDF3EB] to-[#E8F1FF] border-none`
- **아이콘**: `w-12 h-12 bg-white/80 rounded-xl`
- **제목**: `text-xl font-bold text-[#186D50]`

#### 활동 요약
- **항목**: `p-4 bg-[#F8F9FA] rounded-xl`
- **레이아웃**: `flex items-center justify-between`
- **아이콘**: `text-2xl`
- **횟수**: `text-2xl font-bold text-[#25A778]`

#### 패턴 분석
- **항목**: `p-3 bg-[#F8F9FA] rounded-lg`
- **레이아웃**: `flex items-start gap-3`
- **아이콘**: `text-2xl flex-shrink-0`

#### 추천 활동 카드
- **배경**: `p-4 bg-white border-2 border-[#EAEBEC] rounded-xl`
- **Hover**: `hover:border-[#25A778]`
- **아이콘**: `text-2xl`
- **제목**: `font-bold text-[#1B1C1E]`

---

### 2.14 템플릿 선택 (`/dashboard/reflections/templates`)

#### AI 추천 배너
- **배경**: `card border-2 border-[#25A778]/20`
- **아이콘**: `w-12 h-12 bg-[#25A778] rounded-xl`
- **제목**: `font-semibold text-[#1B1C1E]`

#### 카테고리 필터
- **레이아웃**: `flex gap-2 overflow-x-auto`
- **버튼**:
  - 활성: `bg-[#25A778] text-white shadow-md`
  - 비활성: `bg-white text-[#6B6D70]`

#### 템플릿 카드
- **레이아웃**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **스타일**: `card cursor-pointer`
- **선택 상태**: `ring-2 ring-[#25A778] shadow-lg`
- **아이콘 영역**: `w-12 h-12 rounded-xl` (색상별)
- **카테고리 뱃지**: `text-xs px-2 py-0.5 rounded-full`
- **질문 미리보기**: 최대 3개 표시
- **추천 상황 태그**: `px-2 py-1 bg-[#F1F2F3] text-[#6B6D70] rounded text-xs`

#### 선택된 템플릿 액션
- **위치**: `fixed bottom-8 left-1/2 transform -translate-x-1/2`
- **배경**: `bg-white rounded-2xl shadow-2xl p-6`
- **버튼**: 취소, 시작

---

## 3. 컴포넌트 명세

### 3.1 JobSimulation (직무 시뮬레이션)

#### 모달 레이아웃
- **위치**: `fixed inset-0 z-50`
- **배경**: `bg-black/80 backdrop-blur-sm`
- **카드**: `bg-[#1B1C1E] rounded-2xl w-[95vw] h-[95vh]`

#### 헤더
- **배경**: `bg-gradient-to-r from-[#1B1C1E] to-[#2D2F31]`
- **테두리**: `border-b-2 border-[#25A778]`
- **아이콘**: `w-14 h-14 bg-gradient-to-br from-[#25A778] to-[#2DC98E] rounded-xl`

#### 채팅 영역
- **배경**: `bg-[#F1F2F3]`
- **메시지 버블**:
  - 사용자: `bg-[#25A778] text-white rounded-br-none`
  - 봇: `bg-white border border-gray-200 rounded-bl-none`
- **Phase 전환**: `bg-[#1B1C1E] text-white text-center font-bold py-4`

#### 선택지 영역
- **배경**: `bg-gradient-to-t from-[#1B1C1E] via-[#1B1C1E]/98 to-[#1B1C1E]/60`
- **안내 뱃지**: `bg-gradient-to-r from-[#25A778] to-[#2DC98E] text-white rounded-full`
- **선택지 버튼**:
  - 배경: `bg-[#2D2F31]`
  - Hover: `hover:bg-[#25A778]/20 border-2 hover:border-[#25A778]`
  - 번호: `w-7 h-7 bg-gradient-to-br from-[#25A778] to-[#2DC98E] rounded-full`

#### 진행 상황
- **위치**: `absolute top-20 right-6`
- **배경**: `bg-[#1B1C1E]/95 backdrop-blur-sm`
- **프로그레스**: `w-32 h-1.5 bg-[#2D2F31] rounded-full`

---

### 3.2 JobResult (직무 결과)

#### 모달 레이아웃
- **배경**: `bg-black/70 backdrop-blur-sm`
- **카드**: `bg-white rounded-3xl w-[95vw] max-w-6xl max-h-[95vh]`

#### 헤더
- **배경**: `bg-gradient-to-r from-[#DDF3EB] via-[#E8F1FF] to-[#F0E7FF]`
- **아이콘**: `w-16 h-16 bg-gradient-to-br from-[#25A778] to-[#2DC98E] rounded-2xl`

#### 결과 요약
- **배경**: `bg-gradient-to-br from-[#DDF3EB] to-[#E8F1FF] rounded-2xl p-8`
- **아이콘**: `w-20 h-20 bg-gradient-to-br from-[#25A778] to-[#2DC98E] rounded-full`
- **제목**: `text-3xl font-bold`

#### 레이더 차트
- **배경**: `bg-white border-2 border-[#EAEBEC] rounded-2xl p-8`
- **차트**: `w-full h-[400px]`
- **점수 카드**: `grid grid-cols-2 md:grid-cols-3 gap-4`

#### 강점 분석
- **레이아웃**: `grid md:grid-cols-2 gap-4`
- **항목**: `p-4 bg-[#DDF3EB] rounded-xl`
- **번호**: `w-8 h-8 bg-[#25A778] rounded-lg`

#### 추천 활동 카드
- **배경**: `bg-white border-2 border-[#EAEBEC] rounded-2xl p-8`
- **매칭도**: `bg-gradient-to-r from-[#25A778] to-[#2DC98E] text-white rounded-full`
- **D-day**: `bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg animate-pulse`
- **설명**: `bg-[#F8F9FA] rounded-xl p-4`
- **추천 이유**: `bg-gradient-to-r from-[#DDF3EB] to-[#E8F7F2] rounded-xl p-4`
- **혜택**: `bg-[#FFF8E7] border-2 border-[#FFE58F] rounded-xl p-4`

#### AI 코치
- **배경**: `bg-gradient-to-br from-[#F0E7FF] to-[#E8F1FF] rounded-2xl p-8`
- **아이콘**: `w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl`

---

### 3.3 CareerSurvey (경력 설문)

#### 프로그레스
- **레이블**: `text-sm font-medium text-gray-700`
- **퍼센트**: `text-sm text-gray-500`
- **바**: `h-2 bg-gray-200 rounded-full`
  - 진행: `bg-gradient-to-r from-purple-500 to-pink-500`

#### 질문 카드
- **배경**: `bg-white rounded-3xl shadow-lg p-8`
- **제목**: `text-xl font-semibold text-gray-900`

#### Likert Scale
- **레이아웃**: `grid grid-cols-5 gap-3`
- **버튼**: `py-4 px-2 rounded-2xl border-2`
  - 선택: `border-purple-500 bg-purple-50 shadow-md`
  - 비선택: `border-gray-200 hover:border-purple-300`
- **이모지**: `text-2xl`
- **레이블**: `text-sm font-medium text-gray-700`

#### 텍스트 입력
- **스타일**: `w-full px-4 py-3 border-2 border-gray-200 rounded-2xl`
- **Focus**: `focus:border-purple-500 focus:outline-none`
- **높이**: `min-h-[120px]`

#### 선택지
- **단일**: `w-full py-4 px-6 rounded-2xl border-2`
- **다중**: 동일 스타일, 다중 선택 가능

---

### 3.4 CareerResult (경력 결과)

#### 헤더
- **제목**: `text-4xl font-bold text-gray-900`
- **설명**: `text-lg text-gray-600`

#### 추천 직무 강조
- **배경**: `bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8`
- **뱃지**: `bg-white/20 px-4 py-2 rounded-full text-sm font-bold`
- **아이콘**: `text-6xl`
- **제목**: `text-3xl font-bold text-white`
- **정보**: `bg-white/10 rounded-2xl p-4`
- **버튼**: `px-8 py-3 bg-white text-purple-600 rounded-full`

#### Top 3 섹션
- **레이아웃**: `grid md:grid-cols-2 gap-8`
- **제목**: `text-2xl font-bold text-gray-900`
- **카드**: `bg-white rounded-3xl shadow-lg p-6`
  - 순위: `w-12 h-12 rounded-full bg-gradient-to-br` (색상별)
  - 아이콘: `text-4xl`
  - 직무명: `text-xl font-bold`
  - 점수바: `h-3 bg-gray-200 rounded-full`

#### 다음 단계 안내
- **배경**: `bg-white rounded-3xl p-8 shadow-lg`
- **항목**: `flex items-start`
- **번호**: `text-purple-500 font-bold mr-3`

---

## 4. 인터랙션 패턴

### 4.1 버튼 상태

#### 기본 버튼 (btn-primary)
```css
.btn-primary {
  @apply px-6 py-3 bg-[#25A778] text-white font-bold rounded-[16px];
  @apply hover:bg-[#2DC98E] transition-all;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}
```

#### 보조 버튼 (btn-secondary)
```css
.btn-secondary {
  @apply px-6 py-3 bg-white border-2 border-[#EAEBEC] text-[#1B1C1E] font-medium rounded-[12px];
  @apply hover:border-[#25A778] transition-all;
}
```

### 4.2 입력 필드 (input-field)
```css
.input-field {
  @apply w-full px-4 py-3 border-2 border-[#EAEBEC] rounded-[12px];
  @apply focus:border-[#25A778] focus:outline-none;
  @apply transition-colors;
}
```

### 4.3 카드 (card)
```css
.card {
  @apply bg-white rounded-[16px] p-6;
  @apply border border-[#EAEBEC];
  @apply hover:shadow-lg transition-all;
}
```

### 4.4 애니메이션

#### Fade In
- `animate-in fade-in`
- `initial={{ opacity: 0 }}`
- `animate={{ opacity: 1 }}`

#### Slide In
- `slide-in-from-bottom-2`
- `initial={{ opacity: 0, y: 10 }}`
- `animate={{ opacity: 1, y: 0 }}`

#### Scale
- `hover:scale-105`
- `whileHover={{ scale: 1.02 }}`
- `whileTap={{ scale: 0.98 }}`

### 4.5 트랜지션
- **기본**: `transition-all duration-200`
- **색상**: `transition-colors duration-200`
- **그림자**: `transition-shadow duration-300`
- **Transform**: `transition-transform duration-200`

### 4.6 Hover 상태

#### 카드 Hover
- `hover:shadow-lg`
- `hover:border-[#25A778]`
- `hover:scale-105`

#### 버튼 Hover
- `hover:bg-[#2DC98E]` (Primary)
- `hover:border-[#25A778]` (Secondary)
- `hover:shadow-xl` (강조)

#### 텍스트 Hover
- `hover:text-[#25A778]`
- `hover:text-[#2DC98E]`

### 4.7 Focus 상태
- **입력창**: `focus:border-[#25A778] focus:outline-none`
- **버튼**: `focus:ring-2 focus:ring-[#25A778] focus:ring-offset-2`

### 4.8 Disabled 상태
- **버튼**: `disabled:opacity-50 disabled:cursor-not-allowed`
- **입력창**: `disabled:bg-[#F8F9FA] disabled:text-[#CACBCC]`

---

## 5. 반응형 디자인

### 5.1 Breakpoints
- **sm**: `640px`
- **md**: `768px`
- **lg**: `1024px`
- **xl**: `1280px`
- **2xl**: `1536px`

### 5.2 그리드 레이아웃
- **모바일**: `grid-cols-1`
- **태블릿**: `md:grid-cols-2`
- **데스크탑**: `lg:grid-cols-3`, `xl:grid-cols-4`

### 5.3 사이드바
- **모바일**: 숨김 또는 햄버거 메뉴
- **데스크탑**: `w-[240px]` 고정

### 5.4 여백 조정
- **모바일**: `p-4`, `px-4 py-6`
- **데스크탑**: `p-8`, `px-8 py-8`

---

## 6. 접근성

### 6.1 색상 대비
- 주요 텍스트: `#1B1C1E` on `#FFFFFF` (21:1)
- 보조 텍스트: `#6B6D70` on `#FFFFFF` (7:1)
- 버튼: `#FFFFFF` on `#25A778` (4.5:1)

### 6.2 키보드 네비게이션
- 모든 버튼과 링크는 `Tab`으로 접근 가능
- Focus 상태에 명확한 시각적 피드백

### 6.3 스크린 리더
- 아이콘에 `aria-label` 제공
- 이미지에 `alt` 텍스트 제공
- 폼 입력에 `<label>` 연결

---

## 7. 성능 최적화

### 7.1 이미지
- Next.js Image 컴포넌트 사용
- Lazy Loading 적용
- WebP 포맷 우선

### 7.2 폰트
- System Font Stack 사용
- Font Display: swap

### 7.3 애니메이션
- CSS Transform/Opacity 사용
- `will-change` 최소화
- Framer Motion으로 최적화

---

## 8. 브랜드 아이덴티티

### 8.1 로고
- **형태**: `w-8 h-8` ~ `w-12 h-12`
- **배경**: `bg-[#25A778]`
- **모양**: `rounded-[8px]` ~ `rounded-[12px]`
- **텍스트**: "P" (white, extrabold)

### 8.2 브랜드명
- **텍스트**: "PROOF"
- **크기**: `text-xl` ~ `text-2xl`
- **폰트**: `font-bold`
- **색상**: `text-[#1B1C1E]` or `text-white`

### 8.3 톤 앤 매너
- **친근하고 전문적인** 느낌
- **간결하고 직관적인** 언어
- **성장과 발전**을 강조
- **AI 기반 분석**의 신뢰성

---

## 9. 아이콘 시스템

### 9.1 Lucide Icons 사용
- 일관된 스타일
- 크기: `w-4 h-4` ~ `w-8 h-8`
- 색상: 컨텍스트에 따라 변경

### 9.2 주요 아이콘
- **User**: 프로필, 회원
- **Search**: 검색
- **Bell**: 알림
- **FileText**: 문서, 공고
- **Sparkles**: AI, 추천
- **Home**: 홈
- **BookOpen**: 회고
- **TrendingUp**: 성장, 분석
- **Menu**: 메뉴
- **Plus**: 추가
- **Calendar**: 날짜
- **Users**: 팀, 협업
- **Target**: 목표, 매칭
- **ExternalLink**: 외부 링크
- **Bookmark**: 북마크

---

## 10. 에러 및 빈 상태

### 10.1 에러 상태
- **아이콘**: 경고 이모지 (⚠️)
- **색상**: `text-red-500`
- **배경**: `bg-red-50 border-2 border-red-200`
- **메시지**: 명확하고 구체적
- **액션**: 다시 시도 버튼

### 10.2 빈 상태
- **아이콘**: `w-16 h-16 bg-[#F8F9FA] rounded-2xl`
- **메시지**: 친근하고 안내적
- **CTA**: 첫 항목 생성 유도

### 10.3 로딩 상태
- **스피너**: `animate-spin rounded-full border-t-4 border-b-4 border-[#25A778]`
- **스켈레톤**: 회색 배경 + 애니메이션
- **메시지**: "불러오는 중..."

---

## 부록: CSS 유틸리티 클래스

### A. 자주 사용하는 클래스 조합

```css
/* 기본 카드 */
.card {
  @apply bg-white rounded-[16px] p-6 border border-[#EAEBEC];
}

/* 프라이머리 버튼 */
.btn-primary {
  @apply px-6 py-3 bg-[#25A778] text-white font-bold rounded-[16px];
  @apply hover:bg-[#2DC98E] transition-all;
}

/* 세컨더리 버튼 */
.btn-secondary {
  @apply px-6 py-3 bg-white border-2 border-[#EAEBEC] text-[#1B1C1E];
  @apply font-medium rounded-[12px] hover:border-[#25A778] transition-all;
}

/* 입력 필드 */
.input-field {
  @apply w-full px-4 py-3 border-2 border-[#EAEBEC] rounded-[12px];
  @apply focus:border-[#25A778] focus:outline-none transition-colors;
}

/* 뱃지 */
.badge {
  @apply px-2.5 py-1 rounded-[6px] text-xs font-bold;
}

/* 태그 */
.tag {
  @apply px-2 py-1 rounded-[6px] text-xs font-medium;
}
```

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|-----------|
| 2024-01-XX | 1.0 | 초기 문서 작성 |

---

**문서 작성**: AI Assistant  
**최종 업데이트**: 2024-01-XX
