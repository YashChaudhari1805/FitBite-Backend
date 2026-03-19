# FitBite — Backend

> RESTful API for the FitBite fitness and nutrition platform. Handles user authentication, recipe management, workout logging and subscription management.

🔗 **Live API:** [fitbite-backend.onrender.com](https://fitbite-backend.onrender.com)  
🔗 **Frontend Repo:** [github.com/YashChaudhari1805/FitBite-React](https://github.com/YashChaudhari1805/FitBite-React)

---

## Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js >= 20 |
| Framework | Express 5 |
| Database | MongoDB with Mongoose 9 |
| Authentication | JWT (jsonwebtoken) + bcrypt |
| File Uploads | Multer + Cloudinary |
| Dev Server | Nodemon |
| Language | JavaScript (ES Modules) |

---

## API Reference

Base URL: `https://fitbite-backend.onrender.com`

### Users — `/fitbite/users`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/register` | No | Create a new account |
| `POST` | `/login` | No | Login, returns JWT access + refresh tokens |
| `POST` | `/logout` | ✅ | Logout, clears tokens from DB and cookies |
| `GET` | `/me` | ✅ | Get currently authenticated user |
| `PATCH` | `/profile` | ✅ | Update age, height, weight or goal |
| `PATCH` | `/subscription` | ✅ | Change subscription plan (Basic / Pro / Ultimate) |

**Register request body:**
```json
{
  "userName": "johndoe",
  "email": "john@example.com",
  "password": "secret123",
  "age": 25,
  "height": 175,
  "weight": 72,
  "goal": "Muscle Gain"
}
```
Goal must be one of: `Weight Loss`, `Muscle Gain`, `Maintenance`

**Login request body:**
```json
{
  "userName": "johndoe",
  "password": "secret123"
}
```
Either `userName` or `email` can be used.

---

### Recipes — `/fitbite/recipes`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/` | No | Get all recipes, paginated |

**Query parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `page` | number | `1` | Page number |
| `limit` | number | `12` | Results per page |
| `category` | string | — | Filter by `Breakfast`, `Lunch`, `Dinner` or `Snack` |

**Example:** `GET /fitbite/recipes?page=1&limit=12&category=Breakfast`

---

### Workouts — `/fitbite/workouts`

All workout endpoints require authentication.

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/` | ✅ | Get the logged-in user's workout history |
| `POST` | `/` | ✅ | Log a new workout entry |
| `DELETE` | `/:id` | ✅ | Delete a workout entry |

**Log workout request body:**
```json
{
  "exerciseName": "Bench Press",
  "duration": 12,
  "caloriesBurned": 60,
  "intensity": "High",
  "notes": "Felt strong today"
}
```
Intensity must be one of: `Low`, `Medium`, `High`

---

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Returns `{"status":"ok"}` — used by uptime monitors |

---

## Project Structure

```
fitbite-backend/
├── src/
│   ├── controllers/
│   │   ├── user.controller.js      # register, login, logout, me, updateProfile, updateSubscription
│   │   ├── recipe.controller.js    # getAllRecipes
│   │   └── workout.controller.js   # getUserWorkouts, logWorkout, deleteWorkout
│   ├── db/
│   │   └── index.js                # MongoDB connection
│   ├── middlewares/
│   │   ├── auth.middleware.js       # JWT verification — attaches req.user
│   │   └── multer.middleware.js     # File upload config
│   ├── models/
│   │   ├── user.model.js            # User schema with JWT + bcrypt methods
│   │   ├── recipes.model.js         # Recipe schema with aggregate pagination
│   │   └── workout.model.js         # Workout schema
│   ├── routes/
│   │   ├── user.routes.js
│   │   ├── recipe.routes.js
│   │   └── workout.routes.js
│   ├── scripts/
│   │   └── seedRecipes.js           # One-time database seed script
│   ├── utils/
│   │   ├── asyncHandler.js          # Wraps async route handlers
│   │   ├── apiError.js              # Custom error class
│   │   ├── apiResponse.js           # Consistent response shape
│   │   └── cloudinary.js            # Cloudinary upload helper
│   ├── app.js                       # Express app — middleware + routes
│   ├── constants.js                 # DB_NAME constant
│   └── index.js                     # Entry point — connects DB, starts server
├── .env.example
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- A MongoDB database — local or [MongoDB Atlas](https://www.mongodb.com/atlas) 
- A [Cloudinary](https://cloudinary.com/) 

### Installation

```bash
git clone https://github.com/YashChaudhari1805/FitBite-Backend.git
cd FitBite-Backend
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Fill in all values in `.env`. To generate strong JWT secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Run it twice — once for `ACCESS_TOKEN_SECRET`, once for `REFRESH_TOKEN_SECRET`.

### Seed the Database

Run this once after your first server start to populate the recipes collection:

```bash
node src/scripts/seedRecipes.js
```

### Run Locally

```bash
npm run dev
```

Server starts at `http://localhost:3000`

---

## Data Models

### User
```
userName     String   unique, lowercase, indexed
email        String   unique, lowercase
password     String   bcrypt hashed
age          Number
height       Number   (cm)
weight       Number   (kg)
goal         String   Weight Loss | Muscle Gain | Maintenance
subscription String   Basic | Pro | Ultimate
refreshToken String
```

### Recipe
```
title        String   indexed
description  String
image        { url, public_id }
ingredients  [String]
process      [String]
calories     Number
macros       { protein, carbs, fats }
category     String   Breakfast | Lunch | Dinner | Snack
```

### Workout
```
user          ObjectId  ref: User
exerciseName  String    indexed
duration      Number    (minutes)
caloriesBurned Number
intensity     String    Low | Medium | High
notes         String
```

---

## Deployment

Deployed on **Render** (free tier). On every push to `main`, Render automatically redeploys.

For a new deployment:
1. Create a **Web Service** on [render.com](https://render.com)
2. Connect the GitHub repo
3. Set **Build Command:** `npm install`
4. Set **Start Command:** `node src/index.js`
5. Add all environment variables from `.env.example` in the Render dashboard
6. After first deploy, seed the database: `node src/scripts/seedRecipes.js` (run locally pointed at Atlas, or via Render shell on paid plan)

> **Note:** Render free tier spins down after 15 minutes of inactivity. The first request after sleep takes 30–60 seconds.

---

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on (Render sets this automatically) |
| `MONGODB_URI` | MongoDB connection string |
| `CORS_ORIGIN` | Allowed frontend URL e.g. `https://ykfitbite.vercel.app` |
| `ACCESS_TOKEN_SECRET` | JWT secret for access tokens (64+ random chars) |
| `ACCESS_TOKEN_EXPIRY` | Access token lifetime e.g. `1d` |
| `REFRESH_TOKEN_SECRET` | JWT secret for refresh tokens (64+ random chars) |
| `REFRESH_TOKEN_EXPIRY` | Refresh token lifetime e.g. `10d` |
| `CLOUDINARY_CLOUD_NAME` | From your Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From your Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |
| `NODE_ENV` | `development` or `production` |

---

## Author

**Yash Chaudhari**  
Made with ❤️ in Navi Mumbai  
[GitHub](https://github.com/YashChaudhari1805)
