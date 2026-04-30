import type { Score } from '../types/game'

const BASE = import.meta.env.VITE_API_URL ?? ''

export async function fetchLeaderboard(difficulty: string, limit = 10): Promise<Score[]> {
  const res = await fetch(`${BASE}/api/scores?difficulty=${difficulty}&limit=${limit}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function submitScore(data: {
  playerName: string
  difficulty: string
  timeSeconds: number
}): Promise<Score> {
  const res = await fetch(`${BASE}/api/scores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}
