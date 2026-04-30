import { useEffect } from 'react'
import type { GameStatus } from '../types/game'

export function useTimer(status: GameStatus, tick: () => void) {
  useEffect(() => {
    if (status !== 'playing') return
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [status, tick])
}
