import { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { LeaderboardTable } from './LeaderboardTable'
import { useLeaderboard } from '../../hooks/useLeaderboard'
import type { Difficulty } from '../../types/game'

interface Props {
  initialDifficulty: Difficulty
  onClose: () => void
}

const TABS: { key: Exclude<Difficulty, 'custom'>; label: string }[] = [
  { key: 'beginner', label: '초급' },
  { key: 'intermediate', label: '중급' },
  { key: 'expert', label: '고급' },
]

export function LeaderboardModal({ initialDifficulty, onClose }: Props) {
  const defaultTab = initialDifficulty !== 'custom' ? initialDifficulty : 'beginner'
  const [tab, setTab] = useState<Exclude<Difficulty, 'custom'>>(defaultTab as Exclude<Difficulty, 'custom'>)
  const { data, loading, error, load } = useLeaderboard()

  useEffect(() => {
    load(tab)
  }, [tab, load])

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: '3px 12px',
    cursor: 'pointer',
    background: active ? 'var(--color-border-dark)' : 'var(--color-surface)',
    color: active ? '#fff' : '#000',
    fontSize: 13,
    border: 'none',
    borderTop:    '2px solid ' + (active ? 'var(--color-border-dark)' : 'var(--color-border-light)'),
    borderLeft:   '2px solid ' + (active ? 'var(--color-border-dark)' : 'var(--color-border-light)'),
    borderBottom: '2px solid ' + (active ? 'var(--color-border-light)' : 'var(--color-border-dark)'),
    borderRight:  '2px solid ' + (active ? 'var(--color-border-light)' : 'var(--color-border-dark)'),
  })

  return (
    <Modal onClose={onClose} title="🏆 최고 기록">
      <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
        {TABS.map(t => (
          <button key={t.key} style={btnStyle(tab === t.key)} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>
      <LeaderboardTable scores={data} loading={loading} error={error} />
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <button
          onClick={onClose}
          style={{
            padding: '4px 16px', cursor: 'pointer',
            background: 'var(--color-surface)',
            borderTop: '2px solid var(--color-border-light)',
            borderLeft: '2px solid var(--color-border-light)',
            borderBottom: '2px solid var(--color-border-dark)',
            borderRight: '2px solid var(--color-border-dark)',
            fontSize: 13,
          }}
        >
          닫기
        </button>
      </div>
    </Modal>
  )
}
