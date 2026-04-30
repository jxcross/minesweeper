import { Router } from 'express'
import { listScores, createScore } from '../controllers/scoresController.js'
import { validateInsertScore } from '../middleware/validate.js'

const router = Router()

router.get('/', listScores)
router.post('/', validateInsertScore, createScore)

export default router
