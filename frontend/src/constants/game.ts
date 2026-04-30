import type { BoardConfig, Difficulty } from '../types/game'

export const DIFFICULTIES: Record<Exclude<Difficulty, 'custom'>, BoardConfig> = {
  beginner:     { rows: 9,  cols: 9,  mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert:       { rows: 16, cols: 30, mines: 99 },
}

export const DEFAULT_DIFFICULTY: Difficulty = 'beginner'

export const NUMBER_COLORS: Record<number, string> = {
  1: '#0000ff',
  2: '#008000',
  3: '#ff0000',
  4: '#000080',
  5: '#800000',
  6: '#008080',
  7: '#000000',
  8: '#808080',
}

export const MAX_TIMER = 999
