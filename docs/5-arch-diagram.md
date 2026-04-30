# 기술 아키텍처 다이어그램 (Architecture Diagram)

## 1. 시스템 전체 구조

```
┌──────────────────────────────────────────────────────────────────┐
│                          Browser                                 │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │           React SPA  (Vite Dev Server :5173)               │  │
│  │                                                            │  │
│  │  ┌──────────┐   dispatch   ┌──────────────────────────┐   │  │
│  │  │  App.tsx │ ──────────▶  │  useGame (useReducer)    │   │  │
│  │  └────┬─────┘              └────────────┬─────────────┘   │  │
│  │       │ renders                         │ calls           │  │
│  │  ┌────▼──────────────────┐   ┌──────────▼──────────────┐  │  │
│  │  │  Components           │   │  logic/ (순수 함수)      │  │  │
│  │  │  ├─ Board             │   │  ├─ boardFactory.ts     │  │  │
│  │  │  │   └─ Cell ×(r×c)  │   │  ├─ floodFill.ts        │  │  │
│  │  │  ├─ Header            │   │  ├─ gameActions.ts      │  │  │
│  │  │  │   ├─ MineCounter   │   │  └─ winLoss.ts          │  │  │
│  │  │  │   ├─ SmileyButton  │   └─────────────────────────┘  │  │
│  │  │  │   └─ TimerDisplay  │                                 │  │
│  │  │  ├─ DifficultySelector│   ┌─────────────────────────┐  │  │
│  │  │  ├─ ScoreSubmitModal  │   │  useTimer               │  │  │
│  │  │  └─ LeaderboardModal  │   │  useLeaderboard         │  │  │
│  │  └───────────────────────┘   └──────────┬──────────────┘  │  │
│  │                                         │ fetch           │  │
│  │  ┌──────────────────────────────────┐   │                 │  │
│  │  │  api/scores.ts (fetch wrapper)   │◀──┘                 │  │
│  │  └──────────────────────┬───────────┘                     │  │
│  └─────────────────────────┼───────────────────────────────── ┘  │
└────────────────────────────┼─────────────────────────────────────┘
                             │ HTTP REST (JSON)
                             │ /api/scores
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│              Node.js / Express  (:3001)                          │
│                                                                  │
│  routes/scores.ts                                                │
│         │                                                        │
│  middleware/validate.ts  (Zod 검증)                              │
│         │                                                        │
│  controllers/scoresController.ts                                 │
│         │                                                        │
│  models/scoreModel.ts  (DB 쿼리)                                 │
│         │                                                        │
│  db.ts  (better-sqlite3 싱글톤)                                  │
│         │                                                        │
│  backend/data/minesweeper.db  (SQLite 파일)                      │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Mermaid 다이어그램

### 2.1 시스템 아키텍처

```mermaid
graph TB
    subgraph Browser["브라우저 (React SPA :5173)"]
        App["App.tsx"]
        useGame["useGame\n(useReducer)"]
        Logic["logic/\n순수 함수"]
        Components["Components\nBoard / Cell / Header"]
        APIClient["api/scores.ts\n(fetch 래퍼)"]
        useTimer["useTimer"]
        useLeaderboard["useLeaderboard"]
    end

    subgraph Server["Node.js Express (:3001)"]
        Router["routes/scores.ts"]
        Validate["middleware/validate.ts\n(Zod)"]
        Controller["scoresController.ts"]
        Model["scoreModel.ts"]
        DB["db.ts\n(better-sqlite3)"]
        File[("minesweeper.db\nSQLite 파일")]
    end

    App -->|dispatch| useGame
    useGame -->|calls| Logic
    App -->|renders| Components
    useTimer -->|elapsed| App
    useLeaderboard -->|data| App
    useLeaderboard --> APIClient
    App --> APIClient
    APIClient -- "HTTP REST" --> Router
    Router --> Validate
    Validate --> Controller
    Controller --> Model
    Model --> DB
    DB --> File
```

### 2.2 React 컴포넌트 트리

```mermaid
graph TD
    App["App"]
    App --> DS["DifficultySelector"]
    App --> Header["Header"]
    App --> Board["Board"]
    App --> SSM["ScoreSubmitModal\n(승리 시 조건부)"]
    App --> LM["LeaderboardModal\n(트로피 클릭 시)"]

    DS --> CDF["CustomDifficultyForm\n(Custom 탭 시)"]
    Header --> MC["MineCounter\n(SevenSegment×3)"]
    Header --> SB["SmileyButton"]
    Header --> TD["TimerDisplay\n(SevenSegment×3)"]
    Board --> Cell["Cell ×(rows×cols)"]
    LM --> LT["LeaderboardTable"]

    style App fill:#4A90D9,color:#fff
    style Board fill:#7ED321,color:#fff
    style Header fill:#F5A623,color:#fff
```

### 2.3 게임 상태 머신

```mermaid
stateDiagram-v2
    [*] --> idle : 앱 로드 / 리셋

    idle --> playing : 첫 번째 셀 클릭\n(지뢰 배치)

    playing --> playing : 안전 셀 클릭\n플래그 토글\nChord Reveal

    playing --> won : 모든 안전 셀 공개
    playing --> lost : 지뢰 셀 클릭

    won --> idle : 리셋 버튼
    lost --> idle : 리셋 버튼
```

### 2.4 REVEAL_CELL 액션 처리 흐름

```mermaid
sequenceDiagram
    participant User
    participant Cell
    participant useGame
    participant boardFactory
    participant floodFill
    participant winLoss

    User->>Cell: 좌클릭 (row, col)
    Cell->>useGame: dispatch REVEAL_CELL

    alt 첫 번째 클릭
        useGame->>boardFactory: createBoard(config, safeCell)
        boardFactory-->>useGame: 지뢰 배치된 보드
        useGame->>useGame: status = 'playing'
    end

    useGame->>useGame: cell.state = 'revealed'

    alt content === 0
        useGame->>floodFill: bfsReveal(board, row, col)
        floodFill-->>useGame: 연쇄 공개된 보드
    end

    useGame->>winLoss: checkWin(board, config)

    alt 승리
        winLoss-->>useGame: true
        useGame->>useGame: status = 'won'
    else content === 'mine'
        useGame->>winLoss: revealAllMines(board, row, col)
        winLoss-->>useGame: 지뢰 공개된 보드
        useGame->>useGame: status = 'lost'
    end

    useGame-->>Cell: 새 state로 리렌더
```

### 2.5 점수 제출 시퀀스

```mermaid
sequenceDiagram
    participant App
    participant Modal as ScoreSubmitModal
    participant API as api/scores.ts
    participant Express
    participant SQLite

    App->>Modal: show (won + preset difficulty)
    Modal->>User: 이름 입력 폼
    User->>Modal: 이름 입력 후 Submit
    Modal->>API: submitScore({playerName, difficulty, timeSeconds})
    API->>Express: POST /api/scores
    Express->>Express: Zod 유효성 검사
    Express->>SQLite: INSERT INTO scores
    SQLite-->>Express: inserted row
    Express-->>API: 201 Created + Score
    API-->>Modal: Score
    Modal->>App: onSuccess → 리더보드 열기
```

---

## 3. 데이터 흐름 요약

| 방향 | 경로 | 형식 |
|---|---|---|
| 사용자 입력 → 상태 | User → Cell → useGame dispatch → GameState | React Event |
| 상태 → UI | GameState → Board/Header/Cell props | React render |
| 프론트 → 백엔드 | api/scores.ts → POST /api/scores | JSON over HTTP |
| 백엔드 → DB | scoreModel.ts → better-sqlite3 | SQLite |
| 백엔드 → 프론트 | Express → JSON response | JSON over HTTP |

---

## 4. 배포 아키텍처 (프로덕션)

```
Internet
    │
    ▼
Reverse Proxy (Nginx / Caddy)
    ├─ /* ────────────────▶ Static Files (frontend/dist/)
    └─ /api/* ────────────▶ Node.js Express (:3001)
                                    │
                            minesweeper.db (volume)
```
