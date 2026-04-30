import React from 'react'
import type { Cell as CellType } from '../../types/game'
import { NUMBER_COLORS } from '../../constants/game'

interface Props {
  cell: CellType
  isFocused: boolean
  gameOver: boolean
  onReveal: () => void
  onFlag: (e: React.MouseEvent) => void
  onChord: () => void
  onFocus: () => void
}

function getCellContent(cell: CellType, gameOver: boolean): React.ReactNode {
  if (cell.state === 'flagged') {
    if (gameOver && cell.content !== 'mine') return '❌'
    return '🚩'
  }
  if (cell.state === 'questioned') return '?'
  if (cell.state === 'hidden') return null

  if (cell.content === 'mine') return '💣'
  if (cell.content === 0) return null
  return cell.content
}

export function Cell({ cell, isFocused, gameOver, onReveal, onFlag, onChord, onFocus }: Props) {
  const isRevealed = cell.state === 'revealed'
  const isMineCellHit = isRevealed && cell.content === 'mine'

  const raised = !isRevealed

  const style: React.CSSProperties = {
    width: 'var(--cell-size)',
    height: 'var(--cell-size)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: isRevealed ? 'default' : 'pointer',
    userSelect: 'none',
    fontSize: 'clamp(11px, 2vw, 14px)',
    fontWeight: 'bold',
    background: isMineCellHit && (cell as { _hit?: boolean })._hit
      ? 'var(--color-cell-mine-hit)'
      : 'var(--color-surface)',
    outline: isFocused ? '2px solid #005fcc' : undefined,
    outlineOffset: isFocused ? '-2px' : undefined,
    position: 'relative',
    flexShrink: 0,
    color: typeof cell.content === 'number' ? NUMBER_COLORS[cell.content] : undefined,
    ...(raised
      ? {
          borderTop:    '2px solid var(--color-border-light)',
          borderLeft:   '2px solid var(--color-border-light)',
          borderBottom: '2px solid var(--color-border-dark)',
          borderRight:  '2px solid var(--color-border-dark)',
        }
      : {
          border: '1px solid var(--color-border-dark)',
        }),
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1) {
      e.preventDefault()
      onChord()
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (e.button === 0) onReveal()
  }

  const ariaLabel = `Row ${cell.row + 1}, Col ${cell.col + 1}, ${
    cell.state === 'hidden' ? 'hidden' :
    cell.state === 'flagged' ? 'flagged' :
    cell.state === 'questioned' ? 'questioned' :
    cell.content === 'mine' ? 'mine' :
    cell.content === 0 ? 'empty' :
    `${cell.content} adjacent mines`
  }`

  return (
    <div
      role="gridcell"
      aria-label={ariaLabel}
      tabIndex={isFocused ? 0 : -1}
      style={style}
      onClick={handleClick}
      onContextMenu={onFlag}
      onMouseDown={handleMouseDown}
      onFocus={onFocus}
      onDoubleClick={onChord}
    >
      {getCellContent(cell, gameOver)}
    </div>
  )
}
