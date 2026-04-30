import { describe, it, expect } from 'vitest'
import { bfsReveal } from './floodFill'
import type { Board } from '../types/game'

function makeBoard(layout: string[][]): Board {
  return layout.map((row, r) =>
    row.map((ch, c) => ({
      row: r,
      col: c,
      content: ch === 'M' ? 'mine' : parseInt(ch) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
      state: 'hidden' as const,
    }))
  )
}

describe('bfsReveal', () => {
  it('reveals connected zero cells', () => {
    const board = makeBoard([
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
    ])
    const result = bfsReveal(board, 1, 1)
    expect(result.flat().every(c => c.state === 'revealed')).toBe(true)
  })

  it('stops at numbered cells (includes them but does not continue)', () => {
    const board = makeBoard([
      ['0', '0', '1'],
      ['0', '0', '1'],
      ['1', '1', 'M'],
    ])
    const result = bfsReveal(board, 0, 0)
    expect(result[0][2].state).toBe('revealed')
    expect(result[2][2].state).toBe('hidden')
  })

  it('does not reveal mines', () => {
    const board = makeBoard([
      ['0', '1', 'M'],
      ['0', '1', 'M'],
    ])
    const result = bfsReveal(board, 0, 0)
    expect(result[0][2].state).toBe('hidden')
    expect(result[1][2].state).toBe('hidden')
  })

  it('does not reveal flagged cells', () => {
    const board = makeBoard([
      ['0', '0', '0'],
    ])
    board[0][1] = { ...board[0][1], state: 'flagged' }
    const result = bfsReveal(board, 0, 0)
    expect(result[0][1].state).toBe('flagged')
  })

  it('reveals zero and all adjacent number cells, but not beyond numbers', () => {
    // 0 surrounded by 1s — the 1s get revealed but cells beyond them do not
    const board = makeBoard([
      ['2', '2', '2', '2'],
      ['2', '0', '0', '2'],
      ['2', '0', '0', '2'],
      ['2', '2', '2', '2'],
    ])
    const result = bfsReveal(board, 1, 1)
    // Center zeros are revealed
    expect(result[1][1].state).toBe('revealed')
    expect(result[2][2].state).toBe('revealed')
    // Adjacent 2s get revealed (border of flood fill)
    expect(result[0][0].state).toBe('revealed')
    // (BFS stops at numbers — they get revealed but flood doesn't continue through them)
  })
})
