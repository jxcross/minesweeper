import { describe, it, expect } from 'vitest'
import { checkWin, revealAllMines, autoFlagMines } from './winLoss'
import type { Board } from '../types/game'

function makeBoard(layout: Array<Array<{ content: string; state: string }>>): Board {
  return layout.map((row, r) =>
    row.map((cell, c) => ({
      row: r,
      col: c,
      content: cell.content === 'M' ? 'mine' : parseInt(cell.content) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
      state: cell.state as 'hidden' | 'revealed' | 'flagged' | 'questioned',
    }))
  )
}

describe('checkWin', () => {
  it('returns true when all safe cells are revealed', () => {
    const board = makeBoard([
      [{ content: '0', state: 'revealed' }, { content: 'M', state: 'hidden' }],
      [{ content: '1', state: 'revealed' }, { content: '1', state: 'revealed' }],
    ])
    expect(checkWin(board, { rows: 2, cols: 2, mines: 1 })).toBe(true)
  })

  it('returns false when some safe cells are hidden', () => {
    const board = makeBoard([
      [{ content: '0', state: 'hidden' }, { content: 'M', state: 'hidden' }],
      [{ content: '1', state: 'revealed' }, { content: '1', state: 'revealed' }],
    ])
    expect(checkWin(board, { rows: 2, cols: 2, mines: 1 })).toBe(false)
  })

  it('returns false when revealed count is 0', () => {
    const board = makeBoard([
      [{ content: '0', state: 'hidden' }, { content: 'M', state: 'hidden' }],
    ])
    expect(checkWin(board, { rows: 1, cols: 2, mines: 1 })).toBe(false)
  })
})

describe('revealAllMines', () => {
  it('reveals all mine cells on loss', () => {
    const board = makeBoard([
      [{ content: 'M', state: 'hidden' }, { content: 'M', state: 'hidden' }],
      [{ content: '1', state: 'hidden' }, { content: '1', state: 'hidden' }],
    ])
    const result = revealAllMines(board, 0, 0)
    expect(result[0][0].state).toBe('revealed')
    expect(result[0][1].state).toBe('revealed')
  })

  it('keeps correctly flagged mines as flagged', () => {
    const board = makeBoard([
      [{ content: 'M', state: 'flagged' }, { content: 'M', state: 'hidden' }],
    ])
    const result = revealAllMines(board, 0, 1)
    expect(result[0][0].state).toBe('flagged')
  })

  it('reveals incorrectly flagged safe cells', () => {
    const board = makeBoard([
      [{ content: '1', state: 'flagged' }, { content: 'M', state: 'hidden' }],
    ])
    const result = revealAllMines(board, 0, 1)
    expect(result[0][0].state).toBe('revealed')
  })
})

describe('autoFlagMines', () => {
  it('flags all unflagged mines', () => {
    const board = makeBoard([
      [{ content: 'M', state: 'hidden' }, { content: 'M', state: 'flagged' }],
      [{ content: '1', state: 'revealed' }, { content: '1', state: 'revealed' }],
    ])
    const result = autoFlagMines(board)
    expect(result[0][0].state).toBe('flagged')
    expect(result[0][1].state).toBe('flagged')
    expect(result[1][0].state).toBe('revealed')
  })
})
