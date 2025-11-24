# CIRO 백엔드 구현 TODO

> 작성일: 2025-11-24  
> 우선순위: 🔥 높음 | ⚡ 중간 | 💡 낮음

---

## 📋 구현 우선순위

### 🔥 높음 (Week 1-2)

1. **스페이스 멤버 관리**
   - GET `/api/v1/spaces/{space_id}/members` - 팀원 목록 조회
   - space_members 테이블 생성 (user_id, space_id, role, joined_at)
   - role 종류: owner, admin, member
   - users 테이블과 JOIN하여 이름/이메일 반환

2. **이메일 초대 시스템**
   - POST `/api/v1/invites` - 이메일로 팀원 초대
   - invitations 테이블 생성 (space_id, email, token, expires_at, status)
   - 초대 토큰 생성 (UUID, 만료일 7일)
   - SendGrid/AWS SES 연동하여 초대 이메일 발송
   - 이메일 템플릿: 스페이스명, 초대자명, 초대 링크 포함

3. **초대 수락 플로우**
   - GET `/api/v1/invites/verify/{token}` - 토큰 검증 및 스페이스 정보 조회
   - POST `/api/v1/invites/{token}/accept` - 초대 수락 및 space_members에 추가
   - 만료/중복 체크, 초대 상태 업데이트 (pending → accepted)

4. **권한 관리**
   - check_space_permission 미들웨어 구현
   - role 우선순위: owner(3) > admin(2) > member(1)
   - 스페이스 접근 권한 체크 로직

5. **회고-스페이스 연동**
   - POST `/api/v1/reflections` 시 space_id 저장
   - GET `/api/v1/reflections?space_id={id}` - 스페이스별 회고 필터링
   - space_id가 있으면 스페이스 통계 업데이트 (total_reflections 증가)

6. **팀 컨디션 공유**
   - POST `/api/v1/health-check` - 컨디션 저장 (health_score, space_id, date)
   - GET `/api/v1/spaces/{space_id}/health` - 팀원들의 오늘 컨디션 조회
   - health_checks 테이블 생성, 평균 점수 계산
   - 하루에 한 번만 저장되도록 UNIQUE 제약

---

### ⚡ 중간 (Week 3-4)

7. **스페이스 멤버 관리 추가 기능**
   - POST `/api/v1/spaces/{space_id}/members` - 직접 멤버 추가 (관리자 전용)
   - PATCH `/api/v1/spaces/{space_id}/members/{member_id}` - 멤버 역할 변경
   - DELETE `/api/v1/spaces/{space_id}/members/{member_id}` - 멤버 제거 (owner 제외)

8. **알림 시스템**
   - GET `/api/v1/notifications` - 알림 목록 조회 (unread_count 포함)
   - PATCH `/api/v1/notifications/{notification_id}/read` - 알림 읽음 처리
   - POST `/api/v1/spaces/{space_id}/notifications` - 스페이스 알림 전송
   - 알림 타입: reflection_reminder, member_joined, space_updated

9. **회고 공유 및 댓글**
   - PATCH `/api/v1/reflections/{reflection_id}` - 공개 설정 (visibility: private/space/public)
   - POST `/api/v1/reflections/{reflection_id}/comments` - 댓글 작성
   - GET `/api/v1/reflections/{reflection_id}/comments` - 댓글 조회 (대댓글 포함)

10. **사용자 프로필**
    - GET `/api/v1/users/{user_id}` - 프로필 조회 (이름, 이메일, 통계)
    - 통계: total_reflections, total_spaces, current_streak

---

### 💡 낮음 (Week 5+)

11. **스페이스 통계**
    - GET `/api/v1/spaces/{space_id}/stats` - 전체 통계 조회
    - 멤버별 활동, 회고 추세 그래프 데이터

12. **배치 작업**
    - 회고 알림 스케줄러 (매일 오전 9시 실행)
    - 만료된 초대 정리 (매일 자정 실행, status를 expired로 변경)

13. **이메일 서비스**
    - SendGrid API 키 설정 (환경 변수)
    - 이메일 템플릿 관리: 초대, 회고 알림, 주간/월간 리포트

14. **파일 저장소**
    - POST `/api/v1/upload/avatar` - 프로필 이미지 업로드
    - Supabase Storage 연동

---

## 🗄️ 데이터베이스 테이블

### 1. space_members
- id (UUID, PK)
- space_id (UUID, FK → reflection_spaces)
- user_id (UUID, FK → users)
- role (VARCHAR: owner/admin/member)
- joined_at (TIMESTAMPTZ)
- last_active (TIMESTAMPTZ)
- UNIQUE(space_id, user_id)

### 2. invitations
- id (UUID, PK)
- space_id (UUID, FK → reflection_spaces)
- inviter_id (UUID, FK → users)
- email (VARCHAR)
- token (VARCHAR, UNIQUE)
- status (VARCHAR: pending/accepted/expired)
- expires_at (TIMESTAMPTZ)
- accepted_at (TIMESTAMPTZ)
- created_at (TIMESTAMPTZ)
- UNIQUE(space_id, email)

### 3. health_checks
- id (UUID, PK)
- user_id (UUID, FK → users)
- space_id (UUID, FK → reflection_spaces, nullable)
- health_score (INT, 0-100)
- date (DATE)
- created_at (TIMESTAMPTZ)
- UNIQUE(user_id, date, space_id)

### 4. notifications
- id (UUID, PK)
- user_id (UUID, FK → users)
- type (VARCHAR: reflection_reminder/member_joined/space_updated)
- title (VARCHAR)
- message (TEXT)
- is_read (BOOLEAN)
- action_url (VARCHAR)
- created_at (TIMESTAMPTZ)

---

## 🔧 환경 변수

```
# 이메일 서비스
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-api-key
EMAIL_FROM=noreply@ciro.app
EMAIL_FROM_NAME=CIRO

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=your-anon-key
```

---

## 📝 구현 순서

**Week 1-2 (필수 기능)**
1. 데이터베이스 테이블 생성 (space_members, invitations, health_checks)
2. 스페이스 멤버 조회 API
3. 이메일 초대 시스템 (토큰 생성, 이메일 발송)
4. 초대 수락 플로우 (토큰 검증, 멤버 추가)
5. 권한 관리 미들웨어
6. 팀 컨디션 저장 및 조회 API

**Week 3-4 (중요 기능)**
7. 알림 시스템 (notifications 테이블, CRUD API)
8. 회고 공개 설정 및 댓글 기능
9. 사용자 프로필 API
10. 스페이스 멤버 관리 추가 기능 (추가/수정/삭제)

**Week 5+ (선택 기능)**
11. 스페이스 통계 대시보드
12. 배치 작업 스케줄러
13. 파일 업로드 기능
14. 이메일 템플릿 고도화

---

## ✅ 테스트 체크리스트

### 초대 플로우
- [ ] 스페이스 생성 후 owner 자동 추가
- [ ] 이메일 초대 발송 성공
- [ ] 초대 링크 클릭 시 스페이스 정보 표시
- [ ] 초대 수락 후 space_members에 추가
- [ ] 만료된 초대 링크 접근 시 에러 처리
- [ ] 중복 멤버 초대 시 에러 처리

### 권한 관리
- [ ] member는 회고 작성만 가능
- [ ] admin은 멤버 관리 가능
- [ ] owner는 모든 권한 가능
- [ ] 권한 없는 사용자 접근 시 403 에러

### 컨디션 공유
- [ ] 하루에 한 번만 저장 가능
- [ ] 스페이스 멤버만 팀 컨디션 조회 가능
- [ ] 팀 평균 점수 계산 정확성
