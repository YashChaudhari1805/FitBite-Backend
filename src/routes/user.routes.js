import { Router } from 'express'
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateSubscription,
  updateProfile
} from '../controllers/user.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router()

// Public
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)

// Protected
router.route('/logout').post(verifyJWT, logoutUser)
router.route('/me').get(verifyJWT, getCurrentUser)
router.route('/subscription').patch(verifyJWT, updateSubscription)
router.route('/profile').patch(verifyJWT, updateProfile)

export default router
