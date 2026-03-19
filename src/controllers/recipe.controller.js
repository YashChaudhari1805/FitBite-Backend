import { asyncHandler } from '../utils/asyncHandler.js'
import { apiResponse } from '../utils/apiResponse.js'
import { Recipe } from '../models/recipes.model.js'

const getAllRecipes = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 12
  const category = req.query.category

  const match = category ? { category } : {}

  const aggregate = Recipe.aggregate([{ $match: match }, { $sort: { createdAt: -1 } }])

  const options = { page, limit }
  const result = await Recipe.aggregatePaginate(aggregate, options)

  return res.status(200).json(new apiResponse(200, result, 'Recipes fetched'))
})

export { getAllRecipes }
