import { describe, it, expect } from 'vitest'
import { flagCell, revealCell, chordReveal } from './gameActions'
import type { GameState } from '../types/game'
import { createEmptyBoard } from './boardFactory'

function makeState(overrides: Partial<GameState> = {}): GameState {
  const config = { rows: 3, cols: 3, mines: 1 }
  return {
    board: createEmptyBoard(config),
    config,
    difficulty: 'beginner',
    status: 'playing',
    elapsedSeconds: 0,
    minesRemaining: 1,
    firstClickDone: true,
    ...overrides,
  }
}

describe('flagCell', () => {
  it('cycles hidden → flagged → questioned → hidden', () => {
    const state = makeState()
    const s1 = flagCell(state, 0, 0)
    expect(s1.board[0][0].state).toBe('flagged')
    expect(s1.minesRemaining).toBe(0)

    const s2 = flagCell(s1, 0, 0)
    expect(s2.board[0][0].state).toBe('questioned')
    expect(s2.minesRemaining).toBe(1)

    const s3 = flagCell(s2, 0, 0)
    expect(s3.board[0][0].state).toBe('hidden')
    expect(s3.minesRemaining).toBe(1)
  })

  it('does nothing on revealed cell', () => {
    const state = makeState()
    state.board[0][0] = { ...state.board[0][0], state: 'revealed' }
    const result = flagCell(state, 0, 0)
    expect(result.board[0][0].state).toBe('revealed')
  })

  it('does nothing when game is won', () => {
    const state = makeState({ status: 'won' })
    const result = flagCell(state, 0, 0)
    expect(result.board[0][0].state).toBe('hidden')
  })
})

describe('revealCell', () => {
  it('triggers first-click mine placement when firstClickDone is false', () => {
    const state = makeState({ firstClickDone: false, status: 'idle' })
    const result = revealCell(state, 1, 1)
    expect(result.firstClickDone).toBe(true)
  })

  it('does nothing on flagged cell', () => {
    const state = makeState()
    state.board[0][0] = { ...state.board[0][0], state: 'flagged' }
    const result = revealCell(state, 0, 0)
    expect(result.board[0][0].state).toBe('flagged')
  })

  it('does nothing when game is over', () => {
    const state = makeState({ status: 'lost' })
    const result = revealCell(state, 0, 0)
    expect(result).toBe(state)
  })
})

describe('chordReveal', () => {
  it('does nothing on hidden cell', () => {
    const state = makeState()
    const result = chordReveal(state, 0, 0)
    expect(result).toBe(state)
  })

  it('does nothing when flag count does not match cell number', () => {
    const state = makeState()
    state.board[1][1] = { ...state.board[1][1], content: 2, state: 'revealed' }
    state.board[0][0] = { ...state.board[0][0], state: 'flagged' }
    const result = chordReveal(state, 1, 1)
    expect(result).toBe(state)
  })
})
