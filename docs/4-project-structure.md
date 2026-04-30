# 기술 아키텍처 설계 (Project Structure)

## 1. 기술 스택 결정

| 영역 | 기술 | 선택 이유 |
|---|---|---|
| Frontend 프레임워크 | React 18 + TypeScript | 컴포넌트 기반, 타입 안전성, 풍부한 생태계 |
| 빌드 도구 | Vite 5 | 빠른 HMR, 간단한 설정, 프록시 지원 |
| 스타일링 | Tailwind CSS 3 + CSS Variables | 유틸리티 클래스 + 클래식 배색 커스터마이징 |
| 상태 관리 | useReducer (내장 훅) | 외부 라이브러리 불필요한 단순 상태 머신 |
| Backend | Node.js + Express 4 + TypeScript | 가볍고 빠른 REST API 서버 |
| 데이터베이스 | SQLite (better-sqlite3) | 설치 불필요, 동기 API, 리더보드 규모에 적합 |
| 유효성 검사 | Zod | 런타임 타입 검증, TypeScript 타입 자동 추론 |
| Frontend 테스트 | Vitest + React Testing Library | Vite 통합, 빠른 실행 |
| Backend 테스트 | Jest + Supertest | Express 통합 테스트 표준 |

---

## 2. 전체 디렉토리 구조

```
/workspace/projects/minesweeper/
├── docs/
│   ├── 1-domain-definition.md
│   ├── 2-prd.md
│   ├── 3-scenario.md
│   ├── 4-project-structure.md
│   ├── 5-arch-diagram.md
│   ├── 6-erd.md
│   ├── 7-execution-plan.md
│   ├── 8-wireframes.md
│   ├── 9-style-guide.md
│   └── testing-manual.md
│
├── database/
│   └── schema.sql                    ← SQLite 스키마 (단일 소스)
│
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.ts
│   ├── data/
│   │   └── .gitkeep                  ← minesweeper.db 런타임 생성
│   ├── src/
│   │   ├── app.ts                    ← Express 앱 팩토리 (listen 없음)
│   │   ├── server.ts                 ← 엔트리: app.listen(3001)
│   │   ├── db.ts                     ← SQLite 싱글톤 + 스키마 자동 실행
│   │   ├── routes/
│   │   │   └── scores.ts             ← GET/POST /api/scores 라우터
│   │   ├── controllers/
│   │   │   └── scoresController.ts   ← 요청/응답 처리
│   │   ├── models/
│   │   │   └── scoreModel.ts         ← DB 쿼리 순수 함수
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts       ← 전역 에러 핸들러
│   │   │   └── validate.ts           ← Zod 요청 검증 미들웨어
│   │   └── types/
│   │       └── index.ts              ← Score, InsertScore 타입
│   └── tests/
│       ├── scores.test.ts            ← API 통합 테스트 (supertest)
│       └── scoreModel.test.ts        ← 모델 단위 테스트
│
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts                ← /api 프록시 → localhost:3001
│   ├── tailwind.config.ts
│   ├── postcss.config.ts
│   ├── vitest.config.ts
│   ├── index.html
│   ├── public/
│   │   └── favicon.ico
│   └── src/
│       ├── main.tsx                  ← React 마운트
│       ├── App.tsx                   ← 루트 컴포넌트
│       ├── App.test.tsx              ← E2E-like 통합 테스트
│       ├── index.css                 ← Tailwind directives + CSS 변수
│       │
│       ├── types/
│       │   └── game.ts               ← 모든 TS 인터페이스/타입
│       │
│       ├── constants/
│       │   └── game.ts               ← DIFFICULTIES, NUMBER_COLORS, 등
│       │
│       ├── logic/                    ← 순수 함수 (React 의존 없음)
│       │   ├── boardFactory.ts       ← createEmptyBoard, createBoard
│       │   ├── boardFactory.test.ts
│       │   ├── floodFill.ts          ← bfsReveal
│       │   ├── floodFill.test.ts
│       │   ├── gameActions.ts        ← revealCell, flagCell, chordReveal
│       │   ├── gameActions.test.ts
│       │   ├── winLoss.ts            ← checkWin, revealAllMines
│       │   └── winLoss.test.ts
│       │
│       ├── hooks/
│       │   ├── useGame.ts            ← 메인 게임 상태 머신 (useReducer)
│       │   ├── useTimer.ts           ← setInterval 타이머
│       │   └── useLeaderboard.ts     ← 리더보드 fetch 훅
│       │
│       ├── components/
│       │   ├── Board/
│       │   │   ├── Board.tsx
│       │   │   ├── Board.test.tsx
│       │   │   └── index.ts
│       │   ├── Cell/
│       │   │   ├── Cell.tsx
│       │   │   ├── Cell.test.tsx
│       │   │   └── index.ts
│       │   ├── Header/
│       │   │   ├── Header.tsx        ← MineCounter + SmileyButton + TimerDisplay
│       │   │   ├── MineCounter.tsx
│       │   │   ├── TimerDisplay.tsx
│       │   │   ├── SmileyButton.tsx
│       │   │   └── index.ts
│       │   ├── DifficultySelector/
│       │   │   ├── DifficultySelector.tsx
│       │   │   ├── CustomDifficultyForm.tsx
│       │   │   └── index.ts
│       │   ├── Leaderboard/
│       │   │   ├── LeaderboardModal.tsx
│       │   │   ├── LeaderboardTable.tsx
│       │   │   └── index.ts
│       │   ├── ScoreSubmit/
│       │   │   ├── ScoreSubmitModal.tsx
│       │   │   └── index.ts
│       │   └── ui/
│       │       ├── Modal.tsx         ← 범용 모달 래퍼 (Portal)
│       │       ├── SevenSegment.tsx  ← 7-세그먼트 LCD 디스플레이
│       │       └── Button.tsx
│       │
│       ├── api/
│       │   └── scores.ts             ← fetch 래퍼 (fetchLeaderboard, submitScore)
│       │
│       └── utils/
│           └── format.ts             ← formatTime, padDigits
│
├── .gitignore
├── README.md
└── CLAUDE.md
```

---

## 3. 레이어별 역할

### 3.1 Frontend 레이어

```
UI Components (React)
      ↕ props / callbacks
    Hooks (useGame, useTimer, useLeaderboard)
      ↕ dispatch / state
    Logic (순수 함수: boardFactory, floodFill, gameActions, winLoss)
      ↕ HTTP fetch
    API Client (api/scores.ts)
```

**핵심 원칙**: `logic/` 폴더의 모든 함수는 React나 외부 라이브러리 의존성이 없는 순수 함수. 이는 독립적 단위 테스트와 재사용성을 보장한다.

### 3.2 Backend 레이어

```
HTTP Request
    ↓
Express Router (routes/scores.ts)
    ↓
Zod Validation Middleware
    ↓
Controller (scoresController.ts)
    ↓
Model (scoreModel.ts) — DB 쿼리
    ↓
better-sqlite3 → minesweeper.db
```

---

## 4. 핵심 모듈 상세

### 4.1 types/game.ts

모든 TypeScript 타입의 단일 소스:
- `Cell`, `Board`, `BoardConfig`
- `CellContent`, `CellState`
- `Difficulty`, `GameStatus`, `GameState`
- `GameAction` (discriminated union)
- `Score`, `InsertScore`

### 4.2 logic/boardFactory.ts

```ts
// 빈 보드 생성
createEmptyBoard(config: BoardConfig): Board

// 지뢰 배치 + 숫자 계산 (첫 클릭 후 호출)
createBoard(config: BoardConfig, safeCell: {row: number, col: number}): Board

// 내부: 지뢰 셀 주변 숫자 계산
computeAdjacentCounts(board: Board): Board
```

### 4.3 hooks/useGame.ts

```ts
type GameAction =
  | { type: 'REVEAL_CELL'; row: number; col: number }
  | { type: 'FLAG_CELL'; row: number; col: number }
  | { type: 'CHORD_REVEAL'; row: number; col: number }
  | { type: 'RESET' }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty; config: BoardConfig }

function useGame(initialDifficulty?: Difficulty): {
  state: GameState
  revealCell: (row: number, col: number) => void
  flagCell: (row: number, col: number) => void
  chordReveal: (row: number, col: number) => void
  reset: () => void
  setDifficulty: (difficulty: Difficulty, config: BoardConfig) => void
}
```

### 4.4 api/scores.ts

```ts
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

fetchLeaderboard(difficulty: string, limit?: number): Promise<Score[]>
submitScore(data: { playerName: string; difficulty: string; timeSeconds: number }): Promise<Score>
```

---

## 5. 환경 변수

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
```

### Backend (.env)
```
PORT=3001
FRONTEND_URL=http://localhost:5173
DB_PATH=./data/minesweeper.db
```

---

## 6. 개발 서버 실행

```bash
# 백엔드
cd backend
npm install
npm run dev    # tsx watch src/server.ts → :3001

# 프론트엔드
cd frontend
npm install
npm run dev    # vite → :5173
```

### Vite 프록시 설정 (vite.config.ts)

```ts
server: {
  proxy: {
    '/api': 'http://localhost:3001'
  }
}
```

이 설정으로 개발 중 CORS 없이 `/api/*` 요청이 백엔드로 전달된다.
