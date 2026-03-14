import { asyncHandler } from '../utils/asyncHandler.js'
import { apiError } from '../utils/apiError.js'
import { User } from '../models/user.model.js'
import { apiResponse } from '../utils/apiResponse.js'

const registerUser = asyncHandler(async (req, res) => {
    const { userName, email, password, age, height, weight, goal } = req.body

    if ([userName, email, password, age, height, weight, goal].some((field) => field?.trim() === "")) {
        throw new apiError(400, "All fields are required")
    }

    const existedUser = User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new apiError(409, "User already exists")
    }

    User.create({
        userName,
        email,
        password,
        age,
        height,
        weight,
        goal
    })

    const createdUser = await User.findById(User._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new apiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "User Registered Successfully!")
    )

})

export { registerUser }