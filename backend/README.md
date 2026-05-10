# AquaShield AI Backend

Production-ready Node.js/Express backend for the Waterborne Disease Monitoring System.

## Features
- **Admin Auth**: JWT based login/register.
- **Water Data**: Add/Get data with automatic risk calculation.
- **Alerts**: High-risk data automatically triggers alerts.
- **Feedback**: Store and view citizen feedback.
- **Location**: Find nearest monitoring stations.

## Tech Stack
- Node.js & Express.js
- MongoDB & Mongoose
- JWT (JSON Web Token)
- Bcrypt.js (Password hashing)
- CORS & Dotenv

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**
   Update `backend/.env` with your MongoDB URL and JWT Secret.
   ```
   PORT=5000
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=aquashield_db
   JWT_SECRET=your_secret_key
   ```

3. **Seed Database (Optional)**
   Populate the database with dummy monitoring stations and admin account.
   ```bash
   node seed.js
   ```
   *Default Admin:* `admin@aquashield.com` / `admin123password`

4. **Run Server**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register admin
- `POST /api/auth/login` - Login admin

### Water Data
- `POST /api/water` - Add water quality data (Auto-calculates risk)
- `GET /api/water` - Get all data
- `GET /api/water/location/:city` - Filter by city
- `POST /api/water/nearest` - Get nearest station by lat/long

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - View all feedback (Admin Only)

### Alerts
- `GET /api/alerts` - Get all high-risk alerts
