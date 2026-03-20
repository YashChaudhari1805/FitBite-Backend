import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

// Allowed origins — add your Vercel URL here
const allowedOrigins = [
  process.env.CORS_ORIGIN,        
  'http://localhost:5173',         
  'http://localhost:4173',         
].filter(Boolean)                  

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`))
    }
  },
  credentials: true
}))

app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static('public'))
app.use(cookieParser())

// Health check — used by uptime monitors to keep Render awake
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }))

// Routes
import userRouter from './routes/user.routes.js'
import recipeRouter from './routes/recipe.routes.js'
import workoutRouter from './routes/workout.routes.js'

app.use('/fitbite/users', userRouter)
app.use('/fitbite/recipes', recipeRouter)
app.use('/fitbite/workouts', workoutRouter)

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || []
  })
})

export { app }
