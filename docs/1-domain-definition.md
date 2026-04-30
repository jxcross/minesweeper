# 도메인 정의서 (Domain Definition)

## 1. 개요

지뢰찾기(Minesweeper)는 격자(Grid) 형태의 보드 위에서 지뢰가 없는 모든 칸을 열어 승리하는 퍼즐 게임이다. 각 칸은 인접한 지뢰 수의 힌트를 제공하며, 플레이어는 논리적 추론으로 지뢰 위치를 파악한다.

---

## 2. 핵심 도메인 개념

### 2.1 Cell (칸)

보드를 구성하는 최소 단위.

```ts
type CellContent = 'mine' | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
type CellState = 'hidden' | 'revealed' | 'flagged' | 'questioned'

interface Cell {
  row: number        // 0-based 행 인덱스
  col: number        // 0-based 열 인덱스
  content: CellContent  // 지뢰 또는 인접 지뢰 수
  state: CellState      // 현재 표시 상태
}
```

#### CellState 설명

| 상태 | 설명 |
|---|---|
| `hidden` | 아직 열리지 않은 칸 (초기 상태) |
| `revealed` | 플레이어가 열어서 내용이 보이는 상태 |
| `flagged` | 우클릭으로 지뢰 표시를 한 상태 (🚩) |
| `questioned` | 우클릭 두 번째로 물음표 표시 (?) |

#### CellContent 설명

| 값 | 설명 |
|---|---|
| `'mine'` | 지뢰 |
| `0` | 인접 지뢰 없음 (빈 칸) |
| `1`~`8` | 인접 8칸 중 지뢰 수 |

---

### 2.2 Board (보드)

Cell의 2차원 배열. 행(row) × 열(col) 크기의 격자.

```ts
type Board = Cell[][]
```

---

### 2.3 BoardConfig (보드 설정)

```ts
interface BoardConfig {
  rows: number   // 행 수
  cols: number   // 열 수
  mines: number  // 지뢰 수
}
```

#### 난이도 프리셋

| 난이도 | 행 | 열 | 지뢰 |
|---|---|---|---|
| beginner (초급) | 9 | 9 | 10 |
| intermediate (중급) | 16 | 16 | 40 |
| expert (고급) | 16 | 30 | 99 |
| custom (커스텀) | 사용자 지정 | 사용자 지정 | 사용자 지정 |

---

### 2.4 Difficulty (난이도)

```ts
type Difficulty = 'beginner' | 'intermediate' | 'expert' | 'custom'
```

---

### 2.5 GameStatus (게임 상태)

```ts
type GameStatus = 'idle' | 'playing' | 'won' | 'lost'
```

| 상태 | 설명 |
|---|---|
| `idle` | 게임 시작 전 (첫 클릭 대기) |
| `playing` | 게임 진행 중 (타이머 동작) |
| `won` | 승리 (모든 안전 칸 공개) |
| `lost` | 패배 (지뢰 클릭) |

---

### 2.6 GameState (게임 상태 객체)

```ts
interface GameState {
  board: Board
  config: BoardConfig
  difficulty: Difficulty
  status: GameStatus
  elapsedSeconds: number    // 경과 시간 (초)
  minesRemaining: number    // 남은 지뢰 수 = mines - flagCount (음수 가능)
  firstClickDone: boolean   // 첫 클릭 여부 (지뢰 배치 전)
  startTime: number | null  // Date.now() 기반 타이머 시작 시각
}
```

---

### 2.7 Score (점수 기록)

```ts
interface Score {
  id: number
  playerName: string         // 플레이어 이름 (1~30자)
  difficulty: 'beginner' | 'intermediate' | 'expert'  // 커스텀은 저장 안 함
  timeSeconds: number        // 클리어 시간 (초, 1~999)
  achievedAt: string         // ISO 8601 UTC 날짜
}
```

---

## 3. 비즈니스 규칙

### 3.1 지뢰 배치 (Mine Placement)

- **첫 클릭 안전**: 지뢰는 플레이어의 첫 번째 클릭 이후에 배치된다.
- **안전지대**: 첫 클릭 셀과 그 인접 8칸(3×3 영역)은 지뢰에서 제외된다.
- 이후 남은 칸에서 무작위로 `config.mines`개의 지뢰를 배치한다.

### 3.2 자동 공개 (Auto-Reveal / Flood Fill)

- `content === 0`인 칸을 열면, BFS(너비 우선 탐색)로 인접한 빈 칸을 연쇄적으로 공개한다.
- 숫자 칸(1~8)은 공개되지만 그 너머로 전파되지 않는다.
- 지뢰 칸에는 도달하지 않는다.

### 3.3 플래그 (Flagging)

- 우클릭 시: `hidden → flagged → questioned → hidden` 순환
- `flagged` 상태의 칸은 좌클릭으로 열 수 없다.
- `minesRemaining = config.mines - flagCount` (음수 허용)

### 3.4 코드 열기 (Chord Reveal)

- 이미 공개된 숫자 칸에서 중간 버튼 클릭 또는 더블클릭 시:
- 인접 플래그 수 == 해당 숫자 → 비플래그 인접 칸 전부 공개
- 조건 불충족 시 아무 동작 없음

### 3.5 승리 조건

- `revealed` 상태인 비지뢰 칸의 수 == `rows × cols - mines`
- 승리 시: 미플래그 지뢰 자동 플래그, 타이머 정지

### 3.6 패배 조건

- `content === 'mine'`인 칸을 `revealed`로 변경 시
- 패배 시: 모든 지뢰 공개, 잘못 플래그된 칸 표시, 타이머 정지

### 3.7 타이머

- 첫 번째 칸 클릭 시 시작
- 승리 또는 패배 시 정지
- 최대 999초 (3자리 디스플레이)

### 3.8 점수 저장

- 초급/중급/고급 난이도에서 승리 시만 저장
- 커스텀 난이도 점수는 저장하지 않음
- 동일 플레이어가 여러 번 등록 가능 (각 기록 유지)

---

## 4. 도메인 이벤트

| 이벤트 | 트리거 | 결과 |
|---|---|---|
| `REVEAL_CELL` | 좌클릭 | 셀 공개, 첫 클릭 시 지뢰 배치 |
| `FLAG_CELL` | 우클릭 | 상태 순환 |
| `CHORD_REVEAL` | 중간클릭/더블클릭 | 조건부 인접 공개 |
| `RESET` | 스마일 버튼 클릭 | 보드 초기화 |
| `SET_DIFFICULTY` | 난이도 변경 | 보드 재생성 |

---

## 5. 용어 사전 (Glossary)

| 용어 | 영문 | 설명 |
|---|---|---|
| 지뢰 | Mine | 클릭 시 패배하는 칸 |
| 보드 | Board | 게임 격자 전체 |
| 칸 / 셀 | Cell | 보드의 최소 단위 |
| 플래그 | Flag | 지뢰 표시 깃발 |
| 코드 열기 | Chord Reveal | 조건부 인접 공개 |
| 난이도 | Difficulty | 보드 크기 및 지뢰 수 설정 |
| 자동 공개 | Flood Fill | 빈 칸 연쇄 공개 |
| 리더보드 | Leaderboard | 최고 기록 목록 |
