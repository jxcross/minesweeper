import type { GameStatus } from '../../types/game'

interface Props {
  status: GameStatus
  onClick: () => void
}

const EMOJI: Record<GameStatus, string> = {
  idle: '😀',
  playing: '😀',
  won: '😎',
  lost: '😵',
}

export function SmileyButton({ status, onClick }: Props) {
  return (
    <button
      className="bevel-raised"
      onClick={onClick}
      aria-label="Reset game"
      style={{
        width: 36, height: 36,
        background: 'var(--color-surface)',
        border: 'none',
        cursor: 'pointer',
        fontSize: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop:    '2px solid var(--color-border-light)',
        borderLeft:   '2px solid var(--color-border-light)',
        borderBottom: '2px solid var(--color-border-dark)',
        borderRight:  '2px solid var(--color-border-dark)',
        userSelect: 'none',
      }}
      onMouseDown={e => {
        const el = e.currentTarget
        el.style.borderTop    = '2px solid var(--color-border-dark)'
        el.style.borderLeft   = '2px solid var(--color-border-dark)'
        el.style.borderBottom = '2px solid var(--color-border-light)'
        el.style.borderRight  = '2px solid var(--color-border-light)'
      }}
      onMouseUp={e => {
        const el = e.currentTarget
        el.style.borderTop    = '2px solid var(--color-border-light)'
        el.style.borderLeft   = '2px solid var(--color-border-light)'
        el.style.borderBottom = '2px solid var(--color-border-dark)'
        el.style.borderRight  = '2px solid var(--color-border-dark)'
      }}
    >
      {EMOJI[status]}
    </button>
  )
}
