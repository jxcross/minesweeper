import type { GameState } from '../types/game'
import { createBoard } from './boardFactory'
import { bfsReveal } from './floodFill'
import { checkWin, revealAllMines, autoFlagMines } from './winLoss'

export function revealCell(state: GameState, row: number, col: number): GameState {
  if (state.status === 'won' || state.status === 'lost') return state

  const cell = state.board[row][col]
  if (cell.state === 'revealed' || cell.state === 'flagged') return state

  let board = state.board
  let firstClickDone = state.firstClickDone
  let newStatus = state.status

  if (!firstClickDone) {
    board = createBoard(state.config, { row, col })
    firstClickDone = true
    newStatus = 'playing'
  }

  const targetCell = board[row][col]

  if (targetCell.content === 'mine') {
    const revealedBoard = revealAllMines(board, row, col)
    return { ...state, board: revealedBoard, status: 'lost', firstClickDone }
  }

  let newBoard = bfsReveal(board, row, col)

  if (checkWin(newBoard, state.config)) {
    newBoard = autoFlagMines(newBoard)
    return {
      ...state,
      board: newBoard,
      status: 'won',
      firstClickDone,
      minesRemaining: 0,
    }
  }

  return { ...state, board: newBoard, status: newStatus, firstClickDone }
}

export function flagCell(state: GameState, row: number, col: number): GameState {
  if (state.status === 'won' || state.status === 'lost') return state

  const cell = state.board[row][col]
  if (cell.state === 'revealed') return state

  const cycleMap = { hidden: 'flagged', flagged: 'questioned', questioned: 'hidden' } as const
  const newState = cycleMap[cell.state as 'hidden' | 'flagged' | 'questioned']

  const newBoard = state.board.map(r =>
    r.map(c => (c.row === row && c.col === col ? { ...c, state: newState } : c))
  )

  const flagDelta = newState === 'flagged' ? -1 : cell.state === 'flagged' ? 1 : 0
  return {
    ...state,
    board: newBoard,
    minesRemaining: state.minesRemaining + flagDelta,
  }
}

export function chordReveal(state: GameState, row: number, col: number): GameState {
  if (state.status === 'won' || state.status === 'lost') return state

  const cell = state.board[row][col]
  if (cell.state !== 'revealed' || typeof cell.content !== 'number' || cell.content === 0) return state

  const rows = state.board.length
  const cols = state.board[0].length
  let flagCount = 0
  const neighbors: [number, number][] = []

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const nr = row + dr
      const nc = col + dc
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const n = state.board[nr][nc]
        if (n.state === 'flagged') flagCount++
        else if (n.state === 'hidden' || n.state === 'questioned') neighbors.push([nr, nc])
      }
    }
  }

  if (flagCount !== cell.content) return state

  let newState = state
  for (const [nr, nc] of neighbors) {
    newState = revealCell(newState, nr, nc)
    if (newState.status === 'lost') return newState
  }
  return newState
}
