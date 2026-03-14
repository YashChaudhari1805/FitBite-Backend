import mongoose, { Schema } from "mongoose";

const workoutSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    exerciseName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    duration: {
        type: Number,
        required: true
    },
    caloriesBurned: {
        type: Number,
        required: true
    },
    intensity: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

export const Workout = mongoose.model("Workout", workoutSchema);