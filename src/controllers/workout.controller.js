import { asyncHandler } from '../utils/asyncHandler.js'
import { apiError } from '../utils/apiError.js'
import { apiResponse } from '../utils/apiResponse.js'
import { Workout } from '../models/workout.model.js'

// GET /fitbite/workouts/today  — last 7 days of this user's workouts
const getUserWorkouts = asyncHandler(async (req, res) => {
  const workouts = await Workout.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20)

  return res.status(200).json(new apiResponse(200, workouts, 'Workouts fetched'))
})

// POST /fitbite/workouts  — log a completed workout
const logWorkout = asyncHandler(async (req, res) => {
  const { exerciseName, duration, caloriesBurned, intensity, notes } = req.body

  if (!exerciseName || duration === undefined || caloriesBurned === undefined) {
    throw new apiError(400, 'exerciseName, duration and caloriesBurned are required')
  }

  const workout = await Workout.create({
    user: req.user._id,
    exerciseName,
    duration: Number(duration),
    caloriesBurned: Number(caloriesBurned),
    intensity: intensity || 'Medium',
    notes: notes || ''
  })

  return res.status(201).json(new apiResponse(201, workout, 'Workout logged'))
})

// DELETE /fitbite/workouts/:id
const deleteWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  })

  if (!workout) throw new apiError(404, 'Workout not found')

  return res.status(200).json(new apiResponse(200, {}, 'Workout deleted'))
})

export { getUserWorkouts, logWorkout, deleteWorkout }
