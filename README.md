# Team Task Manager (MERN)

Full-stack Team Task Manager. React + Tailwind frontend, Node/Express + MongoDB backend, JWT auth, role-based access (Admin / Member), projects, tasks, and dashboard.

## Structure
```
backend/    Express API + Mongoose models
frontend/   React (Vite) + Tailwind + React Router + Axios
```

## Quick start (local)

### 1. Backend
```
cd backend
cp .env.example .env       # fill in MONGO_URI + JWT_SECRET
npm install
npm run seed               # optional: creates demo users + sample data
npm run dev
```
Backend runs on http://localhost:5000

### 2. Frontend
```
cd frontend
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## Demo accounts (after `npm run seed`)
- Admin:  `admin@demo.com`  / `password123`
- Member: `member@demo.com` / `password123`

## Deploy to Railway

You can deploy backend and frontend as **two separate Railway services** from the same repo.

### Backend service
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables:
  - `MONGO_URI` — your MongoDB Atlas connection string
  - `JWT_SECRET` — long random string
  - `PORT` — Railway sets this automatically
  - `CORS_ORIGIN` — your frontend URL (e.g. `https://your-frontend.up.railway.app`)

### Frontend service
- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Start command: `npm run preview -- --host 0.0.0.0 --port $PORT`
- Environment variables:
  - `VITE_API_URL` — your backend URL + `/api` (e.g. `https://your-backend.up.railway.app/api`)

A `railway.json` is included in each folder.

## API
```
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me

GET    /api/projects
POST   /api/projects           (admin)
PUT    /api/projects/:id       (admin)
DELETE /api/projects/:id       (admin)

GET    /api/tasks
POST   /api/tasks              (admin)
PUT    /api/tasks/:id          (admin or assignee for status)
DELETE /api/tasks/:id          (admin)

GET    /api/users              (admin – list team members)
```
