import { z } from 'zod'
import type { Request, Response, NextFunction } from 'express'

export const insertScoreSchema = z.object({
  playerName: z.string().min(1).max(30),
  difficulty: z.enum(['beginner', 'intermediate', 'expert']),
  timeSeconds: z.number().int().min(1).max(999),
})

export function validateInsertScore(req: Request, res: Response, next: NextFunction): void {
  const result = insertScoreSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({
      error: 'Validation failed',
      details: result.error.errors,
    })
    return
  }
  req.body = result.data
  next()
}
