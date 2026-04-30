import { useState, useCallback } from 'react'
import type { Score } from '../types/game'
import { fetchLeaderboard } from '../api/scores'

interface LeaderboardState {
  data: Score[]
  loading: boolean
  error: string | null
}

export function useLeaderboard() {
  const [state, setState] = useState<LeaderboardState>({
    data: [],
    loading: false,
    error: null,
  })

  const load = useCallback(async (difficulty: string) => {
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const data = await fetchLeaderboard(difficulty)
      setState({ data, loading: false, error: null })
    } catch {
      setState(s => ({ ...s, loading: false, error: '데이터를 불러올 수 없습니다.' }))
    }
  }, [])

  return { ...state, load }
}
