# AquaShield AI – Smart Waterborne Disease Monitoring Dashboard

A government-grade real-time water quality monitoring & disease outbreak prediction dashboard.

## 🚀 Quick Start (Run Locally in Antigravity / VS Code / any IDE)

### Prerequisites
- **Node.js** 18+ (https://nodejs.org)
- **Yarn** (`npm install -g yarn`)
- **MongoDB** running locally on port 27017 (https://www.mongodb.com/try/download/community) **OR** a MongoDB Atlas connection string

### 1. Install dependencies
```bash
yarn install
```

### 2. Configure environment
The `.env` file is already configured for **local MongoDB**:
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=aquashield
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CORS_ORIGINS=*
```

If you prefer **MongoDB Atlas**, replace `MONGO_URL` with your Atlas connection string:
```
MONGO_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net
```

### 3. Start MongoDB (if running locally)
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 4. Run the dev server
```bash
yarn dev
```

Open **http://localhost:3000** in your browser.

The database auto-seeds **12 monitoring stations** across major Indian cities + 2 sample alerts on first request. No manual setup needed.

---

## 🔑 Demo Credentials

- **Admin Panel password:** `aquashield2025`

---

## 📂 Project Structure

```
aquashield-ai/
├── app/
│   ├── api/[[...path]]/route.js   # All backend API endpoints (Next.js route handler)
│   ├── layout.js                  # Root layout (loads Leaflet CDN, fonts, Toaster)
│   ├── page.js                    # Single-page React app: Home / Dashboard / Alerts / Feedback / Admin
│   └── globals.css                # Tailwind + design tokens
├── components/ui/                 # shadcn/ui components (Button, Card, Dialog, etc.)
├── lib/utils.js                   # Tailwind class merge helper
├── .env                           # Environment variables (MONGO_URL, DB_NAME, etc.)
├── package.json                   # Dependencies & scripts
├── tailwind.config.js             # Tailwind config
└── next.config.js                 # Next.js config
```

---

## 🌐 Backend API Reference

All endpoints are served by `app/api/[[...path]]/route.js` and prefixed with `/api`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/stations` | List all monitoring stations with **live computed readings** (pH, turbidity, temp, DO, outbreak probability, risk level). Refreshes every call. |
| GET | `/api/stations/nearest?lat=<>&lng=<>` | Find the nearest station to user coords + distance in km. |
| PUT | `/api/stations/:id` | Admin: set/clear `manualOverride` for a station's base readings. |
| GET | `/api/alerts?city=<>` | List alerts (optional city filter). |
| POST | `/api/alerts` | Admin: publish a new alert `{ title, message, severity, city, district }`. |
| DELETE | `/api/alerts/:id` | Admin: delete an alert. |
| POST | `/api/feedback` | Submit citizen feedback `{ area, description, email, image (base64) }`. |
| GET | `/api/feedback` | Admin: list all feedback submissions. |
| DELETE | `/api/feedback/:id` | Admin: delete a feedback entry. |
| POST | `/api/admin/login` | `{ password }` → `{ ok, token }`. |
| GET | `/api/stats` | Aggregate stats: total stations, safe/moderate/high counts, alerts, feedback. |

---

## 🗃️ Database Schema (MongoDB Collections)

### `stations`
```js
{
  id: "st-del-01",                  // unique slug
  name: "Yamuna Bank Station",
  city: "Delhi",
  district: "Central Delhi",
  lat: 28.6139, lng: 77.2090,
  base: { ph: 7.4, turbidity: 2.1, temp: 24.5, do: 7.2 },  // baseline readings
  manualOverride: null,             // or { base: {...} } when admin overrides
  createdAt: ISODate
}
```
Live `readings` (pH, turbidity, temp, dissolvedOxygen, outbreakProbability, riskLevel, updatedAt) are **computed on every GET** using a sinusoidal noise function on the baseline — simulating real sensor variation. Plug in real sensor data by replacing `computeReadings()` in `route.js`.

### `alerts`
```js
{
  id: "uuid",
  title: "High contamination detected at Bellandur Tank",
  message: "Avoid using untreated water...",
  severity: "high" | "moderate" | "safe",
  city: "Bengaluru",
  district: "Bengaluru Urban",
  createdAt: ISO string
}
```

### `feedback`
```js
{
  id: "uuid",
  area: "Sector 15, Noida",
  description: "Water has yellow tint and bad smell",
  email: "user@example.com",
  image: "data:image/jpeg;base64,...",   // optional, base64
  status: "open",
  createdAt: ISO string
}
```

---

## 🎨 Tech Stack

- **Frontend:** Next.js 14 (App Router) + React 18
- **Styling:** Tailwind CSS + shadcn/ui + Lucide icons
- **Charts:** Recharts (line + area)
- **Maps:** Leaflet via CDN + OpenStreetMap tiles (no API key needed)
- **Backend:** Next.js Route Handlers (Node.js)
- **Database:** MongoDB
- **Theme:** Government Blue + Emerald Green, mobile responsive, card-based

---

## ✨ Features Implemented

- Auto-detect user location via browser Geolocation API → finds nearest of 12 stations
- Live water-safety status badge (Safe / Moderate / High) updates every 5 seconds
- Real-time pH / Turbidity / Temperature / Dissolved Oxygen with WHO safe-range indicators
- AI outbreak-probability gauge (0–100%) with weighted parameter scoring
- Interactive Leaflet map: risk-zone circles sized by probability, color-coded markers, click for popup details
- Live trend charts (pH/DO line, outbreak probability area)
- City & station filter dropdowns
- District-wise risk score table
- Public alert feed with severity-coded cards + warning banner on contamination
- Citizen feedback form with image upload (stored as base64 in MongoDB)
- Password-gated admin panel: review feedback, manually override station readings, publish/delete alerts

---

## 🏗️ Production Deployment

Build for production:
```bash
yarn build
yarn start
```

Deploy easily on Vercel (set the same env vars in dashboard) or any Node host. For MongoDB use Atlas free tier.

---

## 📝 License
Demo project. Free for educational and government evaluation use.
