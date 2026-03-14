import { asyncHandler } from '../utils/asyncHandler.js'
import { apiError } from '../utils/apiError.js'
import { User } from '../models/user.model.js'
import { apiResponse } from '../utils/apiResponse.js'

const registerUser = asyncHandler(async (req, res) => {
    const { userName, email, password, age, height, weight, goal } = req.body

    if (
        [userName, email, password, goal].some((field) => field?.trim() === "") ||
        [age, height, weight].some((num) => num === undefined || num === null)
    ) {
        throw new apiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new apiError(409, "User with this email or username already exists")
    }

    const user = await User.create({
        userName: userName.toLowerCase(),
        email,
        password,
        age,
        height,
        weight,
        goal,
        subscription: "Basic"
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new apiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new apiResponse(201, createdUser, "User Registered Successfully!")
    )
})

export { registerUser }