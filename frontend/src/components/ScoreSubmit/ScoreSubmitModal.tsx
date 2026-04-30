import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { submitScore } from '../../api/scores'
import type { Difficulty } from '../../types/game'

interface Props {
  difficulty: Difficulty
  timeSeconds: number
  onClose: () => void
  onSubmitted: () => void
}

export function ScoreSubmitModal({ difficulty, timeSeconds, onClose, onSubmitted }: Props) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('이름을 입력해 주세요.'); return }
    if (difficulty === 'custom') { onClose(); return }

    setLoading(true)
    setError('')
    try {
      await submitScore({
        playerName: name.trim(),
        difficulty: difficulty as 'beginner' | 'intermediate' | 'expert',
        timeSeconds,
      })
      onSubmitted()
    } catch {
      setError('서버 연결 실패. 점수를 저장할 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  const diffLabel: Record<string, string> = {
    beginner: '초급', intermediate: '중급', expert: '고급',
  }

  return (
    <Modal onClose={onClose} title="🎉 승리!">
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 18, marginBottom: 4 }}>
          ⏱️ {timeSeconds}초 {diffLabel[difficulty] ?? ''}
        </div>
        {difficulty === 'custom' && (
          <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
            커스텀 기록은 저장되지 않습니다.
          </div>
        )}
      </div>

      {difficulty !== 'custom' ? (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>
              이름을 입력하세요:
            </label>
            <input
              autoFocus
              maxLength={30}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="플레이어 이름"
              style={{
                width: '100%', padding: '4px 8px',
                border: '1px solid var(--color-border-dark)',
                fontSize: 14, boxSizing: 'border-box',
              }}
            />
          </div>
          {error && <div style={{ color: 'red', fontSize: 12, marginBottom: 6 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button
              type="submit"
              disabled={loading}
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
              {loading ? '저장 중...' : '등록'}
            </button>
            <button
              type="button"
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
              건너뛰기
            </button>
          </div>
        </form>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={onClose}
            style={{
              padding: '4px 16px', cursor: 'pointer',
              background: 'var(--color-surface)',
              border: '2px solid var(--color-border-dark)',
              fontSize: 13,
            }}
          >
            닫기
          </button>
        </div>
      )}
    </Modal>
  )
}
