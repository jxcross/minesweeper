export type CellContent = 'mine' | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type CellState = 'hidden' | 'revealed' | 'flagged' | 'questioned'
export type Difficulty = 'beginner' | 'intermediate' | 'expert' | 'custom'
export type GameStatus = 'idle' | 'playing' | 'won' | 'lost'

export interface Cell {
  row: number
  col: number
  content: CellContent
  state: CellState
}

export type Board = Cell[][]

export interface BoardConfig {
  rows: number
  cols: number
  mines: number
}

export interface GameState {
  board: Board
  config: BoardConfig
  difficulty: Difficulty
  status: GameStatus
  elapsedSeconds: number
  minesRemaining: number
  firstClickDone: boolean
}

export type GameAction =
  | { type: 'REVEAL_CELL'; row: number; col: number }
  | { type: 'FLAG_CELL'; row: number; col: number }
  | { type: 'CHORD_REVEAL'; row: number; col: number }
  | { type: 'RESET' }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty; config: BoardConfig }
  | { type: 'TICK' }

export interface Score {
  id: number
  playerName: string
  difficulty: 'beginner' | 'intermediate' | 'expert'
  timeSeconds: number
  achievedAt: string
}
