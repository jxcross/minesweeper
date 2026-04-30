import request from 'supertest'
import createApp from '../src/app'
import { closeDb } from '../src/db'

jest.mock('../src/db', () => {
  const Database = require('better-sqlite3')
  const fs = require('fs')
  const path = require('path')

  const SCHEMA_PATH = path.join(__dirname, '../../database/schema.sql')
  const db = new Database(':memory:')
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8')
  db.exec(schema)

  return {
    getDb: () => db,
    closeDb: () => db.close(),
  }
})

const app = createApp()

afterAll(() => {
  closeDb()
})

describe('GET /api/scores', () => {
  it('returns 400 when difficulty is missing', async () => {
    const res = await request(app).get('/api/scores')
    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()
  })

  it('returns 400 for invalid difficulty', async () => {
    const res = await request(app).get('/api/scores?difficulty=master')
    expect(res.status).toBe(400)
  })

  it('returns 200 with empty array for valid difficulty with no data', async () => {
    const res = await request(app).get('/api/scores?difficulty=expert')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

describe('POST /api/scores', () => {
  it('creates a score and returns 201', async () => {
    const res = await request(app).post('/api/scores').send({
      playerName: 'Alice',
      difficulty: 'beginner',
      timeSeconds: 87,
    })
    expect(res.status).toBe(201)
    expect(res.body.playerName).toBe('Alice')
    expect(res.body.difficulty).toBe('beginner')
    expect(res.body.timeSeconds).toBe(87)
    expect(res.body.id).toBeGreaterThan(0)
  })

  it('returns 400 when playerName is missing', async () => {
    const res = await request(app).post('/api/scores').send({
      difficulty: 'beginner',
      timeSeconds: 87,
    })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Validation failed')
  })

  it('returns 400 for invalid difficulty', async () => {
    const res = await request(app).post('/api/scores').send({
      playerName: 'Bob',
      difficulty: 'custom',
      timeSeconds: 87,
    })
    expect(res.status).toBe(400)
  })

  it('returns 400 when timeSeconds is out of range', async () => {
    const res = await request(app).post('/api/scores').send({
      playerName: 'Carol',
      difficulty: 'beginner',
      timeSeconds: 1000,
    })
    expect(res.status).toBe(400)
  })

  it('returns 400 when playerName is too long', async () => {
    const res = await request(app).post('/api/scores').send({
      playerName: 'A'.repeat(31),
      difficulty: 'beginner',
      timeSeconds: 50,
    })
    expect(res.status).toBe(400)
  })
})

describe('GET /api/scores after POST', () => {
  it('returns the submitted score in the leaderboard', async () => {
    await request(app).post('/api/scores').send({
      playerName: 'TestPlayer',
      difficulty: 'intermediate',
      timeSeconds: 300,
    })

    const res = await request(app).get('/api/scores?difficulty=intermediate')
    expect(res.status).toBe(200)
    const found = res.body.find((s: { playerName: string }) => s.playerName === 'TestPlayer')
    expect(found).toBeTruthy()
  })
})
