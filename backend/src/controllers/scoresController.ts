import type { Request, Response, NextFunction } from 'express'
import { getDb } from '../db.js'
import { getTopScores, insertScore } from '../models/scoreModel.js'

const DEFAULT_LIMIT = 10

export function listScores(req: Request, res: Response, next: NextFunction): void {
  try {
    const { difficulty, limit } = req.query

    if (!difficulty || typeof difficulty !== 'string') {
      res.status(400).json({ error: 'difficulty query parameter is required' })
      return
    }

    const validDifficulties = ['beginner', 'intermediate', 'expert']
    if (!validDifficulties.includes(difficulty)) {
      res.status(400).json({ error: 'difficulty must be one of: beginner, intermediate, expert' })
      return
    }

    const parsedLimit = limit ? parseInt(String(limit), 10) : DEFAULT_LIMIT
    const clampedLimit = isNaN(parsedLimit) ? DEFAULT_LIMIT : Math.min(Math.max(parsedLimit, 1), 100)

    const scores = getTopScores(getDb(), difficulty, clampedLimit)
    res.json(scores)
  } catch (err) {
    next(err)
  }
}

export function createScore(req: Request, res: Response, next: NextFunction): void {
  try {
    const score = insertScore(getDb(), req.body)
    res.status(201).json(score)
  } catch (err) {
    next(err)
  }
}
