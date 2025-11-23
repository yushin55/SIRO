# PROOF 데이터베이스 명세서 (Supabase)

> 본 문서는 PROOF 서비스의 Supabase 데이터베이스 스키마를 정의합니다.

---

## 테이블 목록

1. [users](#1-users) - 사용자
2. [spaces](#2-spaces) - 활동 스페이스 (공고, 프로젝트 등)
3. [space_members](#3-space_members) - 스페이스 멤버
4. [reflections](#4-reflections) - 회고 기록
5. [reflection_templates](#5-reflection_templates) - 회고 템플릿
6. [micro_logs](#6-micro_logs) - 마이크로 로그
7. [activities](#7-activities) - 추천 활동
8. [bookmarks](#8-bookmarks) - 북마크
9. [job_simulation_results](#9-job_simulation_results) - 직무 시뮬레이션 결과
10. [career_survey_results](#10-career_survey_results) - 커리어 설문 결과

---

## 1. users

사용자 정보를 저장하는 테이블

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| user_id | varchar(50) | PK | 사용자 ID (로그인용) |
| password | varchar(255) | NOT NULL | 비밀번호 (해시) |
| name | varchar(100) | NOT NULL | 이름 |
| email | varchar(255) | UNIQUE, NOT NULL | 이메일 |
| university | varchar(100) | NULL | 대학교 |
| major | varchar(100) | NULL | 전공 |
| created_at | timestamptz | DEFAULT now() | 생성일시 |
| updated_at | timestamptz | DEFAULT now() | 수정일시 |

---

## 2. spaces

활동 스페이스 (공모전, 프로젝트, 동아리, 인턴십 등)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| space_id | uuid | PK, DEFAULT uuid_generate_v4() | 스페이스 ID |
| user_id | varchar(50) | FK → users.user_id, NOT NULL | 생성자 ID |
| name | varchar(200) | NOT NULL | 스페이스 이름 |
| type | varchar(20) | NOT NULL | 유형 (공모전/프로젝트/동아리/인턴십) |
| description | text | NULL | 설명 |
| start_date | date | NOT NULL | 시작일 |
| end_date | date | NOT NULL | 종료일 |
| reflection_cycle | varchar(20) | NOT NULL | 회고 주기 (매일/주1회/2주1회/월1회) |
| reminder_enabled | boolean | DEFAULT false | 리마인더 활성화 |
| status | varchar(20) | DEFAULT 'active' | 상태 (active/completed/archived) |
| keywords | jsonb | NULL | 키워드 배열 |
| created_at | timestamptz | DEFAULT now() | 생성일시 |
| updated_at | timestamptz | DEFAULT now() | 수정일시 |

**Index**
- `idx_spaces_user_id` on `user_id`
- `idx_spaces_status` on `status`

---

## 3. space_members

스페이스 팀 멤버

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| member_id | uuid | PK, DEFAULT uuid_generate_v4() | 멤버 ID |
| space_id | uuid | FK → spaces.space_id, NOT NULL | 스페이스 ID |
| user_id | varchar(50) | FK → users.user_id, NOT NULL | 사용자 ID |
| role | varchar(20) | DEFAULT 'member' | 역할 (owner/member) |
| joined_at | timestamptz | DEFAULT now() | 참여일시 |

**Unique Constraint**
- `unique_space_member` on `(space_id, user_id)`

**Index**
- `idx_members_space_id` on `space_id`
- `idx_members_user_id` on `user_id`

---

## 4. reflections

회고 기록 (챗봇, 템플릿 기반)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| reflection_id | uuid | PK, DEFAULT uuid_generate_v4() | 회고 ID |
| user_id | varchar(50) | FK → users.user_id, NOT NULL | 사용자 ID |
| space_id | uuid | FK → spaces.space_id, NULL | 스페이스 ID (선택) |
| template_id | uuid | FK → reflection_templates.template_id, NULL | 템플릿 ID |
| type | varchar(20) | NOT NULL | 유형 (chatbot/template/survey) |
| title | varchar(200) | NULL | 제목 |
| content | jsonb | NOT NULL | 회고 내용 (Q&A, STAR 등) |
| ai_feedback | text | NULL | AI 피드백 |
| progress_score | integer | NULL | 진행 점수 (0-100) |
| mood_before | varchar(20) | NULL | 활동 전 기분 |
| mood_after | varchar(20) | NULL | 활동 후 기분 |
| tags | jsonb | NULL | 태그 배열 |
| created_at | timestamptz | DEFAULT now() | 생성일시 |
| updated_at | timestamptz | DEFAULT now() | 수정일시 |

**Index**
- `idx_reflections_user_id` on `user_id`
- `idx_reflections_space_id` on `space_id`
- `idx_reflections_created_at` on `created_at`

---

## 5. reflection_templates

회고 템플릿 (KPT, 4F, Start-Stop-Continue 등)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| template_id | uuid | PK, DEFAULT uuid_generate_v4() | 템플릿 ID |
| name | varchar(100) | NOT NULL | 템플릿 이름 |
| category | varchar(20) | NOT NULL | 카테고리 (기본/심화/감정/분석/정기) |
| description | text | NULL | 설명 |
| icon | varchar(50) | NULL | 아이콘 이름 |
| questions | jsonb | NOT NULL | 질문 배열 |
| recommended_situations | jsonb | NULL | 추천 상황 배열 |
| usage_count | integer | DEFAULT 0 | 사용 횟수 |
| is_active | boolean | DEFAULT true | 활성화 여부 |
| created_at | timestamptz | DEFAULT now() | 생성일시 |

**Index**
- `idx_templates_category` on `category`
- `idx_templates_is_active` on `is_active`

---

## 6. micro_logs

간단한 마이크로 로그 (초라이트 기록)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| log_id | uuid | PK, DEFAULT uuid_generate_v4() | 로그 ID |
| user_id | varchar(50) | FK → users.user_id, NOT NULL | 사용자 ID |
| activity_type | varchar(20) | NOT NULL | 활동 유형 (공모전/프로젝트/동아리/인턴/대외활동/기타) |
| memo | text | NULL | 메모 |
| mood | varchar(20) | NOT NULL | 기분 (good/neutral/bad) |
| mood_reason | varchar(100) | NULL | 기분 이유 |
| tags | jsonb | NULL | AI 생성 태그 |
| created_at | timestamptz | DEFAULT now() | 생성일시 |

**Index**
- `idx_micro_logs_user_id` on `user_id`
- `idx_micro_logs_created_at` on `created_at`

---

## 7. activities

추천 활동 (공모전, 대외활동 등)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| activity_id | uuid | PK, DEFAULT uuid_generate_v4() | 활동 ID |
| title | varchar(200) | NOT NULL | 제목 |
| organization | varchar(200) | NOT NULL | 주최 기관 |
| category | varchar(20) | NOT NULL | 카테고리 (공모전/대외활동/프로젝트/기타) |
| field | varchar(50) | NULL | 분야 (마케팅/기획/개발/디자인/데이터/경영/금융 등) |
| description | text | NULL | 설명 |
| image_url | varchar(500) | NULL | 이미지 URL |
| external_url | varchar(500) | NULL | 외부 링크 |
| start_date | date | NULL | 시작일 |
| end_date | date | NULL | 마감일 |
| tags | jsonb | NULL | 태그 배열 |
| benefits | jsonb | NULL | 혜택 배열 |
| view_count | integer | DEFAULT 0 | 조회수 |
| is_active | boolean | DEFAULT true | 활성화 여부 |
| created_at | timestamptz | DEFAULT now() | 생성일시 |
| updated_at | timestamptz | DEFAULT now() | 수정일시 |

**Index**
- `idx_activities_category` on `category`
- `idx_activities_field` on `field`
- `idx_activities_end_date` on `end_date`
- `idx_activities_is_active` on `is_active`

---

## 8. bookmarks

북마크 (활동)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| bookmark_id | uuid | PK, DEFAULT uuid_generate_v4() | 북마크 ID |
| user_id | varchar(50) | FK → users.user_id, NOT NULL | 사용자 ID |
| activity_id | uuid | FK → activities.activity_id, NOT NULL | 활동 ID |
| created_at | timestamptz | DEFAULT now() | 생성일시 |

**Unique Constraint**
- `unique_user_activity_bookmark` on `(user_id, activity_id)`

**Index**
- `idx_bookmarks_user_id` on `user_id`
- `idx_bookmarks_activity_id` on `activity_id`

---

## 9. job_simulation_results

직무 시뮬레이션 결과

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| result_id | uuid | PK, DEFAULT uuid_generate_v4() | 결과 ID |
| user_id | varchar(50) | FK → users.user_id, NOT NULL | 사용자 ID |
| department | varchar(50) | NOT NULL | 학과 (Business/Economics/Statistics) |
| scores | jsonb | NOT NULL | 직무별 점수 (MKT/PM/DATA/DEV/DESIGN/HR/FIN) |
| top_job | varchar(50) | NOT NULL | 1순위 직무 |
| strengths | jsonb | NULL | 강점 배열 |
| recommendations | jsonb | NULL | 추천사항 배열 |
| ai_analysis | text | NULL | AI 분석 |
| completed_at | timestamptz | DEFAULT now() | 완료일시 |

**Index**
- `idx_job_results_user_id` on `user_id`
- `idx_job_results_completed_at` on `completed_at`

---

## 10. career_survey_results

커리어 설문 결과 (일반 설문 + 스펙 체크)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| survey_id | uuid | PK, DEFAULT uuid_generate_v4() | 설문 ID |
| user_id | varchar(50) | FK → users.user_id, NOT NULL | 사용자 ID |
| survey_type | varchar(20) | NOT NULL | 설문 유형 (general/spec_check) |
| answers | jsonb | NOT NULL | 답변 데이터 |
| preference_top3 | jsonb | NULL | 선호 직무 Top 3 (직무명, 점수) |
| fit_top3 | jsonb | NULL | 적합 직무 Top 3 (직무명, 점수) |
| recommended_job | varchar(50) | NULL | 추천 직무 |
| completed_at | timestamptz | DEFAULT now() | 완료일시 |

**Index**
- `idx_survey_user_id` on `user_id`
- `idx_survey_type` on `survey_type`
- `idx_survey_completed_at` on `completed_at`

---

## 데이터 타입 정의

### space.type
- `공모전`
- `프로젝트`
- `동아리`
- `인턴십`

### space.reflection_cycle
- `매일`
- `주1회`
- `2주1회`
- `월1회`

### space.status
- `active` - 진행 중
- `completed` - 완료
- `archived` - 보관

### reflection.type
- `chatbot` - 챗봇 회고
- `template` - 템플릿 기반 회고
- `survey` - 설문 회고

### reflection_templates.category
- `기본`
- `심화`
- `감정`
- `분석`
- `정기`

### micro_logs.activity_type
- `공모전`
- `프로젝트`
- `동아리`
- `인턴`
- `대외활동`
- `기타`

### micro_logs.mood
- `good` - 좋음
- `neutral` - 보통
- `bad` - 나쁨

### activities.category
- `공모전`
- `대외활동`
- `프로젝트`
- `기타`

### activities.field
- `마케팅`
- `기획`
- `개발`
- `디자인`
- `데이터`
- `경영`
- `금융`
- `기타`

### job_simulation_results.department
- `Business` - 경영학과
- `Economics` - 경제학과
- `Statistics` - 통계학과

### career_survey_results.survey_type
- `general` - 일반 커리어 설문
- `spec_check` - 스펙 체크 설문

---

## Foreign Key 관계

```
users (1) ──< (N) spaces
users (1) ──< (N) space_members
users (1) ──< (N) reflections
users (1) ──< (N) micro_logs
users (1) ──< (N) bookmarks
users (1) ──< (N) job_simulation_results
users (1) ──< (N) career_survey_results

spaces (1) ──< (N) space_members
spaces (1) ──< (N) reflections

reflection_templates (1) ──< (N) reflections

activities (1) ──< (N) bookmarks
```

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|-----------|
| 2025-01-23 | 1.0 | 초기 문서 작성 |

---

**문서 작성**: AI Assistant  
**최종 업데이트**: 2025-01-23
