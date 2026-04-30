import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DB_PATH = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.join(__dirname, '../../data/minesweeper.db')

const SCHEMA_PATH = path.join(__dirname, '../../../database/schema.sql')

function createDb(dbPath: string): Database.Database {
  const dir = path.dirname(dbPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  const db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8')
  db.exec(schema)
  return db
}

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!_db) {
    _db = createDb(DB_PATH)
  }
  return _db
}

export function closeDb(): void {
  if (_db) {
    _db.close()
    _db = null
  }
}

export default getDb
