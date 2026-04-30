import { useState } from 'react'
import type { Difficulty, BoardConfig } from '../../types/game'
import { DIFFICULTIES } from '../../constants/game'

interface Props {
  current: Difficulty
  onChange: (difficulty: Difficulty, config: BoardConfig) => void
}

const LABELS: Record<Difficulty, string> = {
  beginner: '초급',
  intermediate: '중급',
  expert: '고급',
  custom: '커스텀',
}

interface CustomForm {
  rows: string
  cols: string
  mines: string
}

export function DifficultySelector({ current, onChange }: Props) {
  const [customForm, setCustomForm] = useState<CustomForm>({ rows: '9', cols: '9', mines: '10' })
  const [customError, setCustomError] = useState('')

  const difficulties: Difficulty[] = ['beginner', 'intermediate', 'expert', 'custom']

  const handlePreset = (d: Difficulty) => {
    if (d === 'custom') {
      onChange('custom', { rows: 9, cols: 9, mines: 10 })
      return
    }
    onChange(d, DIFFICULTIES[d as Exclude<Difficulty, 'custom'>])
  }

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const rows = parseInt(customForm.rows, 10)
    const cols = parseInt(customForm.cols, 10)
    const mines = parseInt(customForm.mines, 10)
    const maxMines = rows * cols - 9

    if (isNaN(rows) || rows < 5 || rows > 30) { setCustomError('행: 5~30'); return }
    if (isNaN(cols) || cols < 5 || cols > 50) { setCustomError('열: 5~50'); return }
    if (isNaN(mines) || mines < 1 || mines > maxMines) {
      setCustomError(`지뢰: 1~${maxMines}`)
      return
    }
    setCustomError('')
    onChange('custom', { rows, cols, mines })
  }

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: '3px 10px',
    cursor: 'pointer',
    background: active ? 'var(--color-border-dark)' : 'var(--color-surface)',
    color: active ? '#fff' : '#000',
    border: 'none',
    fontSize: 13,
    ...(active
      ? {
          borderTop:    '2px solid var(--color-border-dark)',
          borderLeft:   '2px solid var(--color-border-dark)',
          borderBottom: '2px solid var(--color-border-light)',
          borderRight:  '2px solid var(--color-border-light)',
        }
      : {
          borderTop:    '2px solid var(--color-border-light)',
          borderLeft:   '2px solid var(--color-border-light)',
          borderBottom: '2px solid var(--color-border-dark)',
          borderRight:  '2px solid var(--color-border-dark)',
        }),
  })

  const inputStyle: React.CSSProperties = {
    width: 48, padding: '2px 4px',
    border: '1px solid var(--color-border-dark)',
    background: '#fff', fontSize: 13,
  }

  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
        {difficulties.map(d => (
          <button key={d} style={btnStyle(current === d)} onClick={() => handlePreset(d)}>
            {LABELS[d]}
          </button>
        ))}
      </div>

      {current === 'custom' && (
        <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
          <label>행: <input style={inputStyle} value={customForm.rows} onChange={e => setCustomForm(f => ({ ...f, rows: e.target.value }))} /></label>
          <label>열: <input style={inputStyle} value={customForm.cols} onChange={e => setCustomForm(f => ({ ...f, cols: e.target.value }))} /></label>
          <label>지뢰: <input style={inputStyle} value={customForm.mines} onChange={e => setCustomForm(f => ({ ...f, mines: e.target.value }))} /></label>
          <button type="submit" style={{ ...btnStyle(false), padding: '2px 8px' }}>OK</button>
          {customError && <span style={{ color: 'red', fontSize: 12 }}>⚠️ {customError}</span>}
        </form>
      )}
    </div>
  )
}
