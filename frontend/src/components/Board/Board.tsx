import { useState, useCallback, useEffect } from 'react'
import type { Board as BoardType, GameStatus } from '../../types/game'
import { Cell } from '../Cell'

interface Props {
  board: BoardType
  status: GameStatus
  onReveal: (row: number, col: number) => void
  onFlag: (row: number, col: number) => void
  onChord: (row: number, col: number) => void
}

export function Board({ board, status, onReveal, onFlag, onChord }: Props) {
  const rows = board.length
  const cols = board[0]?.length ?? 0
  const [focusRow, setFocusRow] = useState(0)
  const [focusCol, setFocusCol] = useState(0)
  const gameOver = status === 'won' || status === 'lost'

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        setFocusRow(r => Math.max(0, r - 1))
        break
      case 'ArrowDown':
        e.preventDefault()
        setFocusRow(r => Math.min(rows - 1, r + 1))
        break
      case 'ArrowLeft':
        e.preventDefault()
        setFocusCol(c => Math.max(0, c - 1))
        break
      case 'ArrowRight':
        e.preventDefault()
        setFocusCol(c => Math.min(cols - 1, c + 1))
        break
      case ' ':
      case 'Enter':
        e.preventDefault()
        onReveal(focusRow, focusCol)
        break
      case 'f':
      case 'F':
        e.preventDefault()
        onFlag(focusRow, focusCol)
        break
    }
  }, [rows, cols, focusRow, focusCol, onReveal, onFlag])

  useEffect(() => {
    setFocusRow(0)
    setFocusCol(0)
  }, [rows, cols])

  return (
    <div
      className="panel-inset"
      style={{ display: 'inline-block', overflowX: 'auto', maxWidth: '100%' }}
      onKeyDown={handleKeyDown}
    >
      <div
        role="grid"
        aria-label="Minesweeper board"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, var(--cell-size))`,
          gap: 0,
        }}
      >
        {board.flat().map(cell => (
          <Cell
            key={`${cell.row}-${cell.col}`}
            cell={cell}
            isFocused={cell.row === focusRow && cell.col === focusCol}
            gameOver={gameOver}
            onReveal={() => onReveal(cell.row, cell.col)}
            onFlag={e => { e.preventDefault(); onFlag(cell.row, cell.col) }}
            onChord={() => onChord(cell.row, cell.col)}
            onFocus={() => { setFocusRow(cell.row); setFocusCol(cell.col) }}
          />
        ))}
      </div>
    </div>
  )
}
