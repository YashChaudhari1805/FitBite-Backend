import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const recipeSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: {
            url: String,
            public_id: String
        },
        required: true
    },
    ingredients: [{
        type: String,
        required: true
    }],
    process: [{
        type: String,
        required: true
    }],
    calories: {
        type: Number,
        required: true
    },
    macros: {
        protein: { type: String, default: "0g" },
        carbs: { type: String, default: "0g" },
        fats: { type: String, default: "0g" }
    },
    category: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
        required: true
    }
}, {
    timestamps: true
});

recipeSchema.plugin(mongooseAggregatePaginate)

export const Recipe = mongoose.model("Recipe", recipeSchema);