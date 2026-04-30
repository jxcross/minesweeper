import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'
import { getTopScores, insertScore } from '../src/models/scoreModel'

const SCHEMA_PATH = path.join(__dirname, '../../database/schema.sql')

function createTestDb(): Database.Database {
  const db = new Database(':memory:')
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8')
  db.exec(schema)
  return db
}

describe('scoreModel', () => {
  let db: Database.Database

  beforeEach(() => {
    db = createTestDb()
  })

  afterEach(() => {
    db.close()
  })

  describe('insertScore', () => {
    it('inserts a score and returns the created record', () => {
      const score = insertScore(db, {
        playerName: 'Alice',
        difficulty: 'beginner',
        timeSeconds: 87,
      })

      expect(score.id).toBeGreaterThan(0)
      expect(score.playerName).toBe('Alice')
      expect(score.difficulty).toBe('beginner')
      expect(score.timeSeconds).toBe(87)
      expect(score.achievedAt).toBeTruthy()
    })

    it('auto-increments id for multiple inserts', () => {
      const s1 = insertScore(db, { playerName: 'A', difficulty: 'beginner', timeSeconds: 100 })
      const s2 = insertScore(db, { playerName: 'B', difficulty: 'beginner', timeSeconds: 200 })
      expect(s2.id).toBe(s1.id + 1)
    })
  })

  describe('getTopScores', () => {
    beforeEach(() => {
      insertScore(db, { playerName: 'Alice', difficulty: 'beginner', timeSeconds: 87 })
      insertScore(db, { playerName: 'Bob', difficulty: 'beginner', timeSeconds: 65 })
      insertScore(db, { playerName: 'Carol', difficulty: 'intermediate', timeSeconds: 234 })
      insertScore(db, { playerName: 'Dave', difficulty: 'beginner', timeSeconds: 102 })
    })

    it('returns scores sorted by time_seconds ascending', () => {
      const scores = getTopScores(db, 'beginner', 10)
      expect(scores[0].playerName).toBe('Bob')
      expect(scores[1].playerName).toBe('Alice')
      expect(scores[2].playerName).toBe('Dave')
    })

    it('filters by difficulty', () => {
      const scores = getTopScores(db, 'intermediate', 10)
      expect(scores).toHaveLength(1)
      expect(scores[0].playerName).toBe('Carol')
    })

    it('respects the limit parameter', () => {
      const scores = getTopScores(db, 'beginner', 2)
      expect(scores).toHaveLength(2)
    })

    it('returns empty array for difficulty with no scores', () => {
      const scores = getTopScores(db, 'expert', 10)
      expect(scores).toHaveLength(0)
    })
  })
})
