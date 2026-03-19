import { Router } from 'express'
import { getUserWorkouts, logWorkout, deleteWorkout } from '../controllers/workout.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(verifyJWT) // all workout routes require login

router.route('/').get(getUserWorkouts).post(logWorkout)
router.route('/:id').delete(deleteWorkout)

export default router
