# FitBite — Frontend

A modern fitness and nutrition web app built with **React 19**, **Vite**, **Tailwind CSS 4** and **DaisyUI 5**.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 + DaisyUI 5 |
| Routing | React Router DOM 7 |
| HTTP Client | Axios |
| Font | Candara |

## Features

- **Authentication** — Register and login with JWT. Session is restored automatically on page load.
- **Subscription tiers** — Basic, Pro and Ultimate. Navigation and routes are gated by plan.
- **Recipes** — Browse real recipes fetched from the database, filtered by category with pagination.
- **Workout Tracker** — Log exercises against your profile. View and delete your history.
- **Diet Tracking** — Live food search powered by the [Open Food Facts API](https://world.openfoodfacts.org/) (free, no key needed). Track daily calories and macros.
- **Profile** — View and edit your stats (age, height, weight, goal). Profile image changes based on subscription tier.
- **Pricing** — One-click subscription upgrade that updates your plan in the database instantly.

## Project Structure

```
src/
├── api/              # Axios API functions (auth, recipes, workouts, user)
├── assets/           # Images — logo.jpeg, hero.png, Basic.png, Pro.png, Ultimate.png
├── components/       # All page and UI components
├── context/          # AuthContext — global auth state
└── utils/            # subscriptionAccess.js — access control rules
```

## Getting Started

### Prerequisites

- Node.js >= 20
- The [FitBite backend](../fitbite-backend) running on port 3000

### Installation

```bash
git clone https://github.com/yashchaudhari1805/fitbite-react.git
cd fitbite-react
npm install
```

### Environment Setup

```bash
cp .env.example .env.development
```

The default value (`VITE_API_URL=/fitbite`) works as-is for local development — Vite proxies it to the backend automatically.

### Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173`

### Build for Production

```bash
cp .env.example .env.production
# Edit .env.production — set VITE_API_URL to your deployed backend URL
npm run build
# Deploy the dist/ folder to Vercel, Netlify or Cloudflare Pages
```

## Subscription Access Rules

| Page | Guest | Basic | Pro | Ultimate |
|---|---|---|---|---|
| Home | ✅ | ✅ | ✅ | ✅ |
| About | ✅ | ✅ | ✅ | ✅ |
| Recipes | 🔒 | ✅ | ✅ | ✅ |
| Workout | 🔒 | ✅ | ✅ | ✅ |
| Profile | 🔒 | ✅ | ✅ | ✅ |
| Diet Tracking | 🔒 | 🔒 | ✅ | ✅ |

Access rules live in `src/utils/subscriptionAccess.js` — edit that file to change which plan unlocks which page.

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL for all API calls. Use `/fitbite` locally, your backend URL in production. |

---

Made with ❤️ in Navi Mumbai — Yash Chaudhari
