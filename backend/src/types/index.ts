export interface Score {
  id: number
  playerName: string
  difficulty: 'beginner' | 'intermediate' | 'expert'
  timeSeconds: number
  achievedAt: string
}

export interface InsertScore {
  playerName: string
  difficulty: Score['difficulty']
  timeSeconds: number
}

export type Difficulty = Score['difficulty']
