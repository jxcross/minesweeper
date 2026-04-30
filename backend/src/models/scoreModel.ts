import type Database from 'better-sqlite3'
import type { Score, InsertScore } from '../types/index.js'

interface ScoreRow {
  id: number
  player_name: string
  difficulty: string
  time_seconds: number
  achieved_at: string
}

function toScore(row: ScoreRow): Score {
  return {
    id: row.id,
    playerName: row.player_name,
    difficulty: row.difficulty as Score['difficulty'],
    timeSeconds: row.time_seconds,
    achievedAt: row.achieved_at,
  }
}

export function getTopScores(db: Database.Database, difficulty: string, limit: number): Score[] {
  const rows = db
    .prepare(
      `SELECT id, player_name, difficulty, time_seconds, achieved_at
       FROM scores
       WHERE difficulty = ?
       ORDER BY time_seconds ASC
       LIMIT ?`
    )
    .all(difficulty, limit) as ScoreRow[]
  return rows.map(toScore)
}

export function insertScore(db: Database.Database, data: InsertScore): Score {
  const stmt = db.prepare(
    `INSERT INTO scores (player_name, difficulty, time_seconds)
     VALUES (?, ?, ?)`
  )
  const result = stmt.run(data.playerName, data.difficulty, data.timeSeconds)
  const row = db
    .prepare('SELECT id, player_name, difficulty, time_seconds, achieved_at FROM scores WHERE id = ?')
    .get(result.lastInsertRowid) as ScoreRow
  return toScore(row)
}
