import type { Board, BoardConfig } from '../types/game'

export function checkWin(board: Board, config: BoardConfig): boolean {
  let revealedCount = 0
  for (const row of board) {
    for (const cell of row) {
      if (cell.state === 'revealed') revealedCount++
    }
  }
  const safeCells = config.rows * config.cols - config.mines
  return revealedCount === safeCells
}

export function revealAllMines(board: Board, hitRow: number, hitCol: number): Board {
  return board.map(row =>
    row.map(cell => {
      if (cell.content === 'mine') {
        if (cell.row === hitRow && cell.col === hitCol) {
          return { ...cell, state: 'revealed' as const }
        }
        if (cell.state === 'flagged') return cell
        return { ...cell, state: 'revealed' as const }
      }
      if (cell.state === 'flagged') {
        return { ...cell, state: 'revealed' as const }
      }
      return cell
    })
  )
}

export function autoFlagMines(board: Board): Board {
  return board.map(row =>
    row.map(cell => {
      if (cell.content === 'mine' && cell.state !== 'flagged') {
        return { ...cell, state: 'flagged' as const }
      }
      return cell
    })
  )
}
