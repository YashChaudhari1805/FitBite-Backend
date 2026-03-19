import { asyncHandler } from '../utils/asyncHandler.js'
import { apiError } from '../utils/apiError.js'
import { User } from '../models/user.model.js'
import { apiResponse } from '../utils/apiResponse.js'

// ─── Token helper ────────────────────────────────────────────────────────────
const generateAccessAndRefreshTokens = async (userId) => {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
}

// ─── Cookie options ───────────────────────────────────────────────────────────
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
}

// ─── Register ─────────────────────────────────────────────────────────────────
const registerUser = asyncHandler(async (req, res) => {
    const { userName, email, password, age, height, weight, goal } = req.body

    if (
        [userName, email, password, goal].some((field) => field?.trim() === '') ||
        [age, height, weight].some((num) => num === undefined || num === null)
    ) {
        throw new apiError(400, 'All fields are required')
    }

    const existedUser = await User.findOne({ $or: [{ userName }, { email }] })

    if (existedUser) {
        throw new apiError(409, 'User with this email or username already exists')
    }

    const user = await User.create({
        userName: userName.toLowerCase(),
        email,
        password,
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        goal,
        subscription: 'Basic'
    })

    const createdUser = await User.findById(user._id).select('-password -refreshToken')

    if (!createdUser) {
        throw new apiError(500, 'Something went wrong while registering the user')
    }

    return res
        .status(201)
        .json(new apiResponse(201, createdUser, 'User Registered Successfully!'))
})

// ─── Login ────────────────────────────────────────────────────────────────────
const loginUser = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body

    if (!userName && !email) {
        throw new apiError(400, 'Username or email is required')
    }
    if (!password) {
        throw new apiError(400, 'Password is required')
    }

    const user = await User.findOne({ $or: [{ userName }, { email }] })

    if (!user) {
        throw new apiError(404, 'User does not exist')
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new apiError(401, 'Invalid credentials')
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken')

    return res
        .status(200)
        .cookie('accessToken', accessToken, cookieOptions)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .json(
            new apiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                'User logged in successfully'
            )
        )
})

// ─── Logout ───────────────────────────────────────────────────────────────────
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } },
        { new: true }
    )

    return res
        .status(200)
        .clearCookie('accessToken', cookieOptions)
        .clearCookie('refreshToken', cookieOptions)
        .json(new apiResponse(200, {}, 'User logged out'))
})

// ─── Get current user ─────────────────────────────────────────────────────────
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new apiResponse(200, req.user, 'Current user fetched successfully'))
})

export { registerUser, loginUser, logoutUser, getCurrentUser }
