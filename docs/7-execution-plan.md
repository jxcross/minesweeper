# 작업 분할 및 실행 계획 (Execution Plan)

## 개요

총 8단계(Phase)로 분할하여 순차적으로 구현한다. 각 단계는 이전 단계의 결과물에 의존하므로 순서를 지킨다.

---

## Phase 1: 프로젝트 기반 설정 (Foundation)

### 1.1 루트 설정
- [ ] `.gitignore` 생성 (node_modules, dist, *.db, .env, coverage)
- [ ] `README.md` 업데이트 (개발 설정 방법)

### 1.2 Backend 초기화
```bash
cd backend
npm init -y
npm install express better-sqlite3 zod cors
npm install -D typescript @types/node @types/express @types/better-sqlite3 @types/cors ts-node tsx jest @types/jest ts-jest supertest @types/supertest
```
- [ ] `backend/package.json` scripts: `dev`, `build`, `start`, `test`
- [ ] `backend/tsconfig.json`
- [ ] `backend/jest.config.ts`
- [ ] `backend/data/.gitkeep`

### 1.3 Frontend 초기화
```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install tailwindcss @tailwindcss/vite
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```
- [ ] `frontend/vite.config.ts` (프록시 설정)
- [ ] `frontend/tailwind.config.ts`
- [ ] `frontend/vitest.config.ts`
- [ ] `frontend/src/index.css` (Tailwind + CSS 변수)

---

## Phase 2: 게임 로직 구현 (Core Logic)

### 2.1 타입 및 상수 정의
- [ ] `frontend/src/types/game.ts` — 모든 인터페이스/타입
- [ ] `frontend/src/constants/game.ts` — DIFFICULTIES, NUMBER_COLORS, MAX_TIMER

### 2.2 순수 함수 구현
- [ ] `boardFactory.ts` — createEmptyBoard, createBoard(placeMines+computeNumbers)
- [ ] `floodFill.ts` — bfsReveal (BFS 자동 공개)
- [ ] `gameActions.ts` — revealCell, flagCell, chordReveal
- [ ] `winLoss.ts` — checkWin, revealAllMines

### 2.3 로직 단위 테스트
- [ ] `boardFactory.test.ts`
- [ ] `floodFill.test.ts`
- [ ] `gameActions.test.ts`
- [ ] `winLoss.test.ts`

**완료 기준**: `npm test` 전체 통과

---

## Phase 3: React 훅 구현 (Hooks)

### 3.1 메인 게임 훅
- [ ] `useGame.ts` — GameAction 유니온 + gameReducer + useReducer

### 3.2 보조 훅
- [ ] `useTimer.ts` — setInterval 기반 경과 시간 추적
- [ ] `useLeaderboard.ts` — 리더보드 데이터 fetch

---

## Phase 4: Backend API 구현

### 4.1 데이터베이스
- [ ] `backend/src/db.ts` — better-sqlite3 싱글톤, schema.sql 자동 실행

### 4.2 API 엔드포인트
- [ ] `backend/src/types/index.ts`
- [ ] `backend/src/models/scoreModel.ts` — getTopScores, insertScore
- [ ] `backend/src/middleware/validate.ts` — Zod 검증
- [ ] `backend/src/middleware/errorHandler.ts`
- [ ] `backend/src/controllers/scoresController.ts`
- [ ] `backend/src/routes/scores.ts`
- [ ] `backend/src/app.ts` — Express 앱 팩토리
- [ ] `backend/src/server.ts` — app.listen(3001)

### 4.3 Backend 테스트
- [ ] `backend/tests/scoreModel.test.ts` — in-memory SQLite
- [ ] `backend/tests/scores.test.ts` — Supertest 통합 테스트

**완료 기준**: `npm test` 전체 통과, `npm run dev` 실행 후 curl 테스트 통과

---

## Phase 5: UI 컴포넌트 구현

### 5.1 UI 기반 컴포넌트
- [ ] `ui/Modal.tsx` — Portal 기반 범용 모달
- [ ] `ui/SevenSegment.tsx` — 7-세그먼트 LCD 디스플레이
- [ ] `ui/Button.tsx`

### 5.2 핵심 게임 컴포넌트
- [ ] `Cell/Cell.tsx` — bevel 스타일, 좌/우/중간 클릭, aria-label
- [ ] `Board/Board.tsx` — CSS Grid, 키보드 이벤트
- [ ] `Header/MineCounter.tsx`
- [ ] `Header/TimerDisplay.tsx`
- [ ] `Header/SmileyButton.tsx`
- [ ] `Header/Header.tsx`

### 5.3 부가 컴포넌트
- [ ] `DifficultySelector/DifficultySelector.tsx`
- [ ] `DifficultySelector/CustomDifficultyForm.tsx`
- [ ] `ScoreSubmit/ScoreSubmitModal.tsx`
- [ ] `Leaderboard/LeaderboardTable.tsx`
- [ ] `Leaderboard/LeaderboardModal.tsx`

### 5.4 API 클라이언트
- [ ] `api/scores.ts`
- [ ] `utils/format.ts`

---

## Phase 6: 통합 및 완성 (Integration)

### 6.1 App.tsx 통합
- [ ] useGame + useTimer 연결
- [ ] 모달 상태 관리 (scoreSubmit, leaderboard)
- [ ] 키보드 이벤트 핸들러
- [ ] confetti 애니메이션

### 6.2 스타일 완성
- [ ] CSS 변수 확정 (bevel, LCD, 색상)
- [ ] Tailwind 테마 커스터마이징
- [ ] 반응형 셀 크기 (clamp)
- [ ] 접근성 (focus ring, aria)

---

## Phase 7: 테스트 (Testing)

### 7.1 Frontend 컴포넌트 테스트
- [ ] `Cell.test.tsx`
- [ ] `Board.test.tsx`
- [ ] `App.test.tsx` (E2E-like)

### 7.2 전체 테스트 실행
- [ ] Frontend: `npm test` + `npm run coverage`
- [ ] Backend: `npm test` + `npm run coverage`

---

## Phase 8: 문서화 (Documentation)

### 8.1 매뉴얼
- [ ] `docs/testing-manual.md` — 수동 테스트 시나리오 10개
- [ ] `README.md` 업데이트 — 설치, 실행, 빌드 방법

---

## 의존성 그래프

```
Phase 1 (설정)
    │
    ├──▶ Phase 2 (게임 로직)
    │         │
    │         └──▶ Phase 3 (React 훅)
    │                   │
    └──▶ Phase 4 (Backend)    │
                              │
              Phase 5 (UI 컴포넌트) ◀──(Phase 3 완료 후)
                    │
                    └──▶ Phase 6 (통합)
                               │
                    Phase 7 (테스트) ◀──(Phase 4+6 완료 후)
                               │
                    Phase 8 (문서) ◀──(Phase 7 완료 후)
```

---

## 예상 소요 시간

| Phase | 예상 시간 |
|---|---|
| Phase 1: 기반 설정 | 1일 |
| Phase 2: 게임 로직 | 1일 |
| Phase 3: React 훅 | 0.5일 |
| Phase 4: Backend | 1일 |
| Phase 5: UI 컴포넌트 | 2일 |
| Phase 6: 통합 | 1일 |
| Phase 7: 테스트 | 0.5일 |
| Phase 8: 문서화 | 0.5일 |
| **합계** | **7.5일** |
