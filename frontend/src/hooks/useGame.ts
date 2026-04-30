import { useReducer, useCallback } from 'react'
import type { GameState, GameAction, Difficulty, BoardConfig } from '../types/game'
import { createEmptyBoard } from '../logic/boardFactory'
import { revealCell, flagCell, chordReveal } from '../logic/gameActions'
import { DIFFICULTIES, DEFAULT_DIFFICULTY } from '../constants/game'

function makeInitialState(difficulty: Difficulty, config: BoardConfig): GameState {
  return {
    board: createEmptyBoard(config),
    config,
    difficulty,
    status: 'idle',
    elapsedSeconds: 0,
    minesRemaining: config.mines,
    firstClickDone: false,
  }
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'REVEAL_CELL':
      return revealCell(state, action.row, action.col)

    case 'FLAG_CELL':
      return flagCell(state, action.row, action.col)

    case 'CHORD_REVEAL':
      return chordReveal(state, action.row, action.col)

    case 'RESET':
      return makeInitialState(state.difficulty, state.config)

    case 'SET_DIFFICULTY':
      return makeInitialState(action.difficulty, action.config)

    case 'TICK':
      if (state.status !== 'playing') return state
      return { ...state, elapsedSeconds: Math.min(state.elapsedSeconds + 1, 999) }

    default:
      return state
  }
}

export function useGame(initialDifficulty: Difficulty = DEFAULT_DIFFICULTY) {
  const initialConfig = initialDifficulty !== 'custom'
    ? DIFFICULTIES[initialDifficulty as Exclude<Difficulty, 'custom'>]
    : DIFFICULTIES.beginner

  const [state, dispatch] = useReducer(gameReducer, makeInitialState(initialDifficulty, initialConfig))

  const reveal = useCallback((row: number, col: number) => {
    dispatch({ type: 'REVEAL_CELL', row, col })
  }, [])

  const flag = useCallback((row: number, col: number) => {
    dispatch({ type: 'FLAG_CELL', row, col })
  }, [])

  const chord = useCallback((row: number, col: number) => {
    dispatch({ type: 'CHORD_REVEAL', row, col })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  const setDifficulty = useCallback((difficulty: Difficulty, config: BoardConfig) => {
    dispatch({ type: 'SET_DIFFICULTY', difficulty, config })
  }, [])

  const tick = useCallback(() => {
    dispatch({ type: 'TICK' })
  }, [])

  return { state, reveal, flag, chord, reset, setDifficulty, tick }
}
