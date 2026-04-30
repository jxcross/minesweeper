import { describe, it, expect } from 'vitest'
import { createBoard, createEmptyBoard } from './boardFactory'

describe('createEmptyBoard', () => {
  it('creates correct dimensions', () => {
    const board = createEmptyBoard({ rows: 5, cols: 7, mines: 5 })
    expect(board.length).toBe(5)
    expect(board[0].length).toBe(7)
  })

  it('all cells are hidden with content 0', () => {
    const board = createEmptyBoard({ rows: 3, cols: 3, mines: 1 })
    for (const row of board) {
      for (const cell of row) {
        expect(cell.state).toBe('hidden')
        expect(cell.content).toBe(0)
      }
    }
  })
})

describe('createBoard', () => {
  it('places correct number of mines', () => {
    const board = createBoard({ rows: 9, cols: 9, mines: 10 }, { row: 4, col: 4 })
    const mineCount = board.flat().filter(c => c.content === 'mine').length
    expect(mineCount).toBe(10)
  })

  it('safe cell does not contain a mine', () => {
    for (let i = 0; i < 10; i++) {
      const board = createBoard({ rows: 9, cols: 9, mines: 10 }, { row: 4, col: 4 })
      expect(board[4][4].content).not.toBe('mine')
    }
  })

  it('safe zone (3x3 around first click) contains no mines', () => {
    for (let i = 0; i < 20; i++) {
      const board = createBoard({ rows: 9, cols: 9, mines: 10 }, { row: 4, col: 4 })
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          expect(board[4 + dr][4 + dc].content).not.toBe('mine')
        }
      }
    }
  })

  it('computes correct adjacent counts', () => {
    const config = { rows: 3, cols: 3, mines: 0 }
    const emptyBoard = createEmptyBoard(config)
    emptyBoard[0][0] = { ...emptyBoard[0][0], content: 'mine' }
    const result = createBoard({ rows: 3, cols: 3, mines: 1 }, { row: 2, col: 2 })
    const mineCount = result.flat().filter(c => c.content === 'mine').length
    expect(mineCount).toBe(1)
  })

  it('cell coordinates are correct', () => {
    const board = createBoard({ rows: 4, cols: 5, mines: 3 }, { row: 0, col: 0 })
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 5; c++) {
        expect(board[r][c].row).toBe(r)
        expect(board[r][c].col).toBe(c)
      }
    }
  })
})
