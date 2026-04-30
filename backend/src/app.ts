import express from 'express'
import cors from 'cors'
import scoresRouter from './routes/scores.js'
import { errorHandler } from './middleware/errorHandler.js'

function createApp() {
  const app = express()

  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  }))

  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/api/scores', scoresRouter)

  app.use(errorHandler)

  return app
}

export default createApp
