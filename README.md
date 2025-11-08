# LinkedIn Clone — Internship Assignment (Monorepo)

**Stack**: React (frontend) + Node.js + Express (backend) + MongoDB

This repository is prepared to run locally on any system and be pushed to GitHub.
It uses a simple UI (as requested) and the display name "Welcome Rohit" in the feed.

## Quick start (local)

### 1) Clone the repo
```bash
git clone <repo-url>
cd linkedin-clone
```

### 2) Backend
```bash
cd backend
# 1) install
npm install
# 2) copy .env.example -> .env and set MONGO_URI with your password:
#    MONGO_URI=mongodb+srv://arun:<db_password>@cluster0.bj9ilwb.mongodb.net/?appName=Cluster0
cp .env.example .env
# edit .env to replace <db_password> with your Atlas password (do NOT commit real password)
npm run dev
```

Server runs on http://localhost:5000

### 3) Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm start
```

Frontend runs on http://localhost:3000

### 4) How it works
- Signup at the Signup page; then login at Login page.
- After login you can create posts; posts show in Feed (latest first).
- Token-based auth is used. Frontend stores token and user in localStorage.

## Deploying
- Backend: use Render.app or Railway — set environment variables `MONGO_URI` and `JWT_SECRET`.
- Frontend: use Netlify or Vercel — set `REACT_APP_API_BASE` to your deployed backend (e.g. https://your-backend.onrender.com)

## Notes
- The provided `.env.example` already contains your Mongo URI with a placeholder for `<db_password>`.
- Replace `<db_password>` with your real password **locally** or set the proper var in your deployment settings.
- This is intentionally simple for easy testing and grading.

Good luck with your assignment! — Generated for Rohit
