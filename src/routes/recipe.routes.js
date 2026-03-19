import { Router } from 'express'
import { getAllRecipes } from '../controllers/recipe.controller.js'

const router = Router()

router.route('/').get(getAllRecipes)

export default router
