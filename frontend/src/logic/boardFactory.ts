import type { Board, BoardConfig, Cell } from '../types/game'

function createEmptyBoard(config: BoardConfig): Board {
  const board: Board = []
  for (let r = 0; r < config.rows; r++) {
    board[r] = []
    for (let c = 0; c < config.cols; c++) {
      board[r][c] = { row: r, col: c, content: 0, state: 'hidden' }
    }
  }
  return board
}

function getSafeZone(config: BoardConfig, safeRow: number, safeCol: number): Set<string> {
  const safe = new Set<string>()
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = safeRow + dr
      const c = safeCol + dc
      if (r >= 0 && r < config.rows && c >= 0 && c < config.cols) {
        safe.add(`${r},${c}`)
      }
    }
  }
  return safe
}

function placeMines(board: Board, config: BoardConfig, safeZone: Set<string>): Board {
  const candidates: [number, number][] = []
  for (let r = 0; r < config.rows; r++) {
    for (let c = 0; c < config.cols; c++) {
      if (!safeZone.has(`${r},${c}`)) {
        candidates.push([r, c])
      }
    }
  }

  const mineCount = Math.min(config.mines, candidates.length)
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
  }

  const newBoard = board.map(row => row.map(cell => ({ ...cell })))
  for (let i = 0; i < mineCount; i++) {
    const [r, c] = candidates[i]
    newBoard[r][c] = { ...newBoard[r][c], content: 'mine' }
  }
  return newBoard
}

function computeAdjacentCounts(board: Board): Board {
  const rows = board.length
  const cols = board[0].length
  const result = board.map(row => row.map(cell => ({ ...cell })))

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (result[r][c].content === 'mine') continue
      let count = 0
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr
          const nc = c + dc
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].content === 'mine') {
            count++
          }
        }
      }
      result[r][c] = { ...result[r][c], content: count as Cell['content'] }
    }
  }
  return result
}

export function createBoard(config: BoardConfig, safeCell: { row: number; col: number }): Board {
  const empty = createEmptyBoard(config)
  const safeZone = getSafeZone(config, safeCell.row, safeCell.col)
  const withMines = placeMines(empty, config, safeZone)
  return computeAdjacentCounts(withMines)
}

export { createEmptyBoard }
