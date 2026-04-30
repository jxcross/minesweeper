import type { Board } from '../types/game'

export function bfsReveal(board: Board, startRow: number, startCol: number): Board {
  const rows = board.length
  const cols = board[0].length
  const result = board.map(row => row.map(cell => ({ ...cell })))

  const queue: [number, number][] = [[startRow, startCol]]
  const visited = new Set<string>()
  visited.add(`${startRow},${startCol}`)

  while (queue.length > 0) {
    const [r, c] = queue.shift()!
    const cell = result[r][c]

    if (cell.state === 'flagged' || cell.state === 'revealed') continue
    if (cell.content === 'mine') continue

    result[r][c] = { ...cell, state: 'revealed' }

    if (cell.content !== 0) continue

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        const nr = r + dr
        const nc = c + dc
        const key = `${nr},${nc}`
        if (
          nr >= 0 && nr < rows &&
          nc >= 0 && nc < cols &&
          !visited.has(key) &&
          result[nr][nc].state !== 'revealed' &&
          result[nr][nc].content !== 'mine'
        ) {
          visited.add(key)
          queue.push([nr, nc])
        }
      }
    }
  }

  return result
}
