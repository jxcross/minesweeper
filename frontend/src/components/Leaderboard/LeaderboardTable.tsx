import type { Score } from '../../types/game'

interface Props {
  scores: Score[]
  loading: boolean
  error: string | null
}

function formatDate(iso: string): string {
  return iso.split('T')[0]
}

export function LeaderboardTable({ scores, loading, error }: Props) {
  if (loading) {
    return <div style={{ textAlign: 'center', padding: 20, color: '#666' }}>로딩 중...</div>
  }
  if (error) {
    return <div style={{ textAlign: 'center', padding: 20, color: 'red', fontSize: 13 }}>{error}</div>
  }
  if (scores.length === 0) {
    return <div style={{ textAlign: 'center', padding: 20, color: '#666', fontSize: 13 }}>기록이 없습니다.</div>
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--color-border-dark)' }}>
          <th style={{ padding: '4px 6px', textAlign: 'right', width: 30 }}>#</th>
          <th style={{ padding: '4px 6px', textAlign: 'left' }}>이름</th>
          <th style={{ padding: '4px 6px', textAlign: 'right', width: 60 }}>시간</th>
          <th style={{ padding: '4px 6px', textAlign: 'right', width: 90 }}>날짜</th>
        </tr>
      </thead>
      <tbody>
        {scores.map((s, i) => (
          <tr
            key={s.id}
            style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.05)' }}
          >
            <td style={{ padding: '3px 6px', textAlign: 'right', color: i === 0 ? '#c08000' : '#666' }}>
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
            </td>
            <td style={{ padding: '3px 6px' }}>{s.playerName}</td>
            <td style={{ padding: '3px 6px', textAlign: 'right', fontFamily: 'monospace' }}>{s.timeSeconds}s</td>
            <td style={{ padding: '3px 6px', textAlign: 'right', color: '#666' }}>{formatDate(s.achievedAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
