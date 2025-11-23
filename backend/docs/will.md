ㄴ# CIRO 백엔드 구현 TODO

> 프론트엔드 완료, 백엔드 API 구현 필요  
> 작성일: 2025-11-24

---

## 🔥 우선순위 높음 (필수 기능)

### 1. 스페이스 멤버 관리
- **API**: `GET /api/v1/spaces/{space_id}/members`
- 스페이스 소속 팀원 목록 조회
- 역할(owner, admin, member) 정보 포함
- users 테이블과 JOIN하여 이름, 이메일 반환

### 2. 이메일 초대 시스템
- **API**: `POST /api/v1/invites`
- 이메일로 팀원 초대
- 초대 토큰 생성 (7일 유효)
- SendGrid/AWS SES 연동하여 실제 이메일 발송
- invitations 테이블 생성 필요

### 3. 초대 수락 처리
- **API**: `GET /api/v1/invites/verify/{token}` - 토큰 검증
- **API**: `POST /api/v1/invites/{token}/accept` - 초대 수락
- 토큰 검증 후 space_members 테이블에 추가
- 초대 상태를 pending → accepted로 업데이트

### 4. 권한 관리 미들웨어
- 스페이스 접근 권한 체크 함수 구현
- owner > admin > member 계층 구조
- 각 API에서 필요한 최소 권한 검증

### 5. 컨디션 공유 시스템
- **API**: `POST /api/v1/health-check` - 컨디션 저장
- **API**: `GET /api/v1/spaces/{space_id}/health` - 팀원 컨디션 조회
- health_checks 테이블 생성 (user_id, space_id, health_score, date)
- 팀 평균 컨디션 계산 로직

### 6. 회고-스페이스 연동
- 회고 작성 시 space_id 필드 저장 지원
- `GET /api/v1/reflections?space_id={id}` - 스페이스별 회고 필터링
- 스페이스 멤버만 조회 가능하도록 권한 체크

---

## ⚡ 우선순위 중간 (향상 기능)

### 7. 회고 작성 알림 스케줄러
- 매일 오전 9시 실행
- next_reflection_date 확인하여 알림 대상 조회
- 스페이스 멤버들에게 회고 작성 알림 전송
- 다음 회고 날짜 자동 업데이트

### 8. 알림 시스템
- **API**: `GET /api/v1/notifications` - 알림 목록 조회
- **API**: `PATCH /api/v1/notifications/{id}/read` - 읽음 처리
- notifications 테이블 생성
- 알림 타입: reflection_reminder, member_joined, space_updated

### 9. 멤버 관리 기능
- **API**: `POST /api/v1/spaces/{space_id}/members` - 멤버 직접 추가
- **API**: `PATCH /api/v1/spaces/{space_id}/members/{id}` - 역할 변경
- **API**: `DELETE /api/v1/spaces/{space_id}/members/{id}` - 멤버 제거
- owner/admin만 실행 가능

### 10. 회고 공개 설정
- **API**: `PATCH /api/v1/reflections/{id}` - 공개 범위 변경
- visibility: private, space, public
- 스페이스 멤버 간 회고 공유 기능

---

## 💡 우선순위 낮음 (선택 기능)

### 11. 좋아요 시스템
- **API**: `POST /api/v1/reflections/{id}/favorite` - 좋아요 토글
- **API**: `GET /api/v1/reflections?favorited=true` - 좋아요한 기록만 조회
- favorites 테이블 생성 (user_id, reflection_id, created_at)
- 마이크로 로그와 AI 회고 모두 좋아요 가능
- is_favorited 필드를 응답에 포함

### 12. 회고 댓글 시스템
- **API**: `POST /api/v1/reflections/{id}/comments` - 댓글 작성
- **API**: `GET /api/v1/reflections/{id}/comments` - 댓글 조회
- 대댓글 지원 (parent_id)

### 13. 사용자 프로필
- **API**: `GET /api/v1/users/{id}` - 프로필 조회
- **API**: `PATCH /api/v1/users/me` - 프로필 수정
- 프로필 이미지 업로드

### 14. 스페이스 통계
- **API**: `GET /api/v1/spaces/{space_id}/stats`
- 전체 회고 수, 멤버 활동도, 회고 트렌드
- 주간/월간 리포트 생성

### 15. 만료 초대 정리 배치
- 매일 자정 실행
- 만료된 초대 상태를 expired로 변경

---

## 📦 필요한 DB 테이블

### space_members
```
id, space_id, user_id, role, joined_at, last_active
UNIQUE(space_id, user_id)
```

### invitations
```
id, space_id, inviter_id, email, token, status, expires_at, accepted_at, created_at
UNIQUE(space_id, email)
```

### health_checks
```
id, user_id, space_id, health_score, date, created_at
UNIQUE(user_id, date, space_id)
```

### notifications
```
id, user_id, type, title, message, is_read, action_url, created_at
```

### favorites
```
id, user_id, reflection_id, reflection_type (micro/star), created_at
UNIQUE(user_id, reflection_id, reflection_type)
```

---

## 🔧 환경 변수 추가 필요

```env
# 이메일 서비스
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-api-key
EMAIL_FROM=noreply@ciro.app
EMAIL_FROM_NAME=CIRO

# 프론트엔드 URL (초대 링크용)
FRONTEND_URL=https://ciro.app
```

---

## ✅ 구현 순서 권장

1. **Week 1**: 스페이스 멤버 관리 + 권한 체크
2. **Week 2**: 이메일 초대 + 수락 처리
3. **Week 3**: 컨디션 공유 + 회고-스페이스 연동
4. **Week 4**: 알림 시스템 + 회고 알림 스케줄러
5. **Week 5+**: 추가 기능 (댓글, 통계 등)

---

## 📝 참고 사항

- 모든 API는 `x-user-id` 헤더 필수
- 스페이스 관련 API는 멤버 권한 체크 필수
- 이메일 발송은 비동기 처리 권장 (Celery, RQ 등)
- 알림은 실시간 WebSocket 또는 폴링 방식
- 프론트엔드는 모두 구현 완료, 백엔드만 연동하면 즉시 작동

## 🆕 최근 추가 기능 (2025-11-24)

### 회고 기록 관리 개선
- `/dashboard/reflections/history` - 전체 기록 목록 페이지
  - 필터: 전체 / 이번 주 / 좋아요
  - 마이크로 로그 + AI 회고 통합 표시
  - 좋아요 버튼 UI 구현 (백엔드 API 필요)

### 빠른 기록 확인 기능
- 빠른 기록 작성 완료 후 상세 페이지로 이동
- `/dashboard/reflections/[id]`에서 마이크로 로그 표시
  - 활동 유형, 메모, 기분, 이유, AI 태그 표시
  - AI 회고와 다른 레이아웃으로 표시

### 더보기 기능
- 통계 카드에 더보기 버튼 추가
  - 이번 주 → `/history?filter=week`
  - 좋았던 경험 → `/history?filter=favorites`
  - 최근 7일 기록 → `/history` (전체)

### 백엔드 필요 API
1. **좋아요 토글**: `POST /api/v1/reflections/{id}/favorite`
   - 마이크로 로그와 AI 회고 모두 지원
   - 이미 좋아요면 취소, 없으면 추가
   - 응답: `{ "success": true, "is_favorited": true/false }`

2. **좋아요 목록 조회**: `GET /api/v1/reflections?favorited=true`
   - 사용자가 좋아요한 모든 기록 반환 (마이크로 + AI 회고)

3. **기록 상세 조회**: `GET /api/v1/reflections/micro/{id}`
   - 단일 마이크로 로그 상세 조회
   - 현재는 전체 목록에서 필터링하고 있음

4. **응답에 is_favorited 추가**
   - `/api/v1/reflections` (AI 회고)
   - `/api/v1/reflections/micro` (빠른 기록)
   - 각 항목에 `is_favorited: boolean` 필드 추가

4a. **단일 AI 회고 조회**: `GET /api/v1/reflections/{id}`
   - 단일 AI 회고(Reflection) 상세 반환
   - 응답에 `is_favorited`, `competencies`, `ai_feedback`, `created_at` 등 포함
   - visibility가 `space`인 경우 요청자와 스페이스 멤버 여부 검증 필요
   - 권한(visibility)에 따라 403 또는 404 처리 권장

5. **기록 삭제**: `DELETE /api/v1/reflections/{id}` (AI 회고)
   - AI 회고 삭제 및 관련 통계/연결 정리

6. **마이크로 로그 삭제**: `DELETE /api/v1/reflections/micro/{id}`
   - 빠른 기록(Micro) 단건 삭제

7. **스페이스 삭제**: `DELETE /api/v1/spaces/{id}`
   - 스페이스 삭제 시 관련 space_members, invitations, health_checks 정리(또는 CASCADE)

8. **통계 요약 API (선택)**: `GET /api/v1/reflections/summary`
   - 사용자의 전체 기록, 이번주 카운트, 연속 작성(연속일), 활동 유형별 개수, 연결된 스페이스 개수, 상위 키워드 반환
   - 권장 응답 필드:
     - `total_reflections` (int): 전체 회고/기록 수
     - `this_week_count` (int): 최근 7일 작성 수
     - `consecutive_days` (int): 연속 작성 일수 (오늘 포함)
     - `activity_type_counts` (object): 활동유형별 카운트, 예: {"project": 5, "study": 3}
     - `spaces_count` (int): 연결(작성)한 스페이스 개수
     - `top_keywords` (array): [{"keyword": "협업", "count": 4}, ...]
   - 사용 예: 프론트엔드의 대시보드 요약(총 회고 · 이번주 · 연속 작성 · 활동/스페이스/키워드)을 빠르게 렌더링하기 위함
   - 프론트엔드에서 클라이언트 집계 대신 빠르게 표현 가능
