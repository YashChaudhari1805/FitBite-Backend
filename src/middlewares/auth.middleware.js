import jwt from 'jsonwebtoken'
import { asyncHandler } from '../utils/asyncHandler.js'
import { apiError } from '../utils/apiError.js'
import { User } from '../models/user.model.js'

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
        throw new apiError(401, 'Unauthorized request')
    }

    let decoded
    try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    } catch {
        throw new apiError(401, 'Invalid or expired access token')
    }

    const user = await User.findById(decoded._id).select('-password -refreshToken')

    if (!user) {
        throw new apiError(401, 'Invalid access token')
    }

    req.user = user
    next()
})
