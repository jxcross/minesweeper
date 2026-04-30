import type { GameStatus } from '../../types/game'
import { SevenSegment } from '../ui/SevenSegment'
import { SmileyButton } from './SmileyButton'

interface Props {
  minesRemaining: number
  elapsed: number
  status: GameStatus
  onReset: () => void
}

export function Header({ minesRemaining, elapsed, status, onReset }: Props) {
  return (
    <div
      className="panel-inset"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 8px',
        marginBottom: 4,
        background: 'var(--color-surface)',
      }}
    >
      <SevenSegment value={Math.max(-99, Math.min(minesRemaining, 999))} digits={3} />
      <SmileyButton status={status} onClick={onReset} />
      <SevenSegment value={elapsed} digits={3} />
    </div>
  )
}
