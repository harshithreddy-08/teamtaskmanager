TEAM TASK MANAGER

A modern full-stack MERN application for efficient team collaboration, project management, and task tracking with role-based access control.


LIVE DEMO

https://teamtaskmanager-production-c148.up.railway.app

PROJECT OVERVIEW

Team Task Manager is a collaborative productivity platform designed for organizations and teams to efficiently manage projects, assign tasks, track progress, and monitor team performance in real time.

The application provides:

- Secure JWT Authentication
- Role-Based Access Control
- Project & Task Management
- Team Collaboration
- Real-Time Dashboard Analytics
- Production Deployment on Railway

FEATURES

Authentication & Security

- User Signup & Login
- JWT-based Authentication
- Password Hashing using bcryptjs
- Protected API Routes
- Persistent Login Sessions

Role-Based Access Control

Admin:
- Create/Edit/Delete Projects
- Create/Edit/Delete Tasks
- Assign Tasks to Team Members
- Manage Team Workflow

Member:
- View Assigned Tasks
- Update Task Status
- Track Progress

Project Management

- Create New Projects
- Add Team Members
- Edit Project Details
- Delete Projects
- View Project Progress

Task Management

- Create Tasks
- Assign Deadlines
- Set Task Priorities
- Update Task Status
- Filter Tasks
- Track Completion

Dashboard Analytics

- Total Tasks
- Completed Tasks
- Pending Tasks
- Overdue Tasks
- Project Progress Statistics
- Recent Activities


TECH STACK

Frontend
- React.js (Vite)
- Tailwind CSS
- React Router DOM
- Axios
- Context API

Backend
- Node.js
- Express.js

Database
- MongoDB Atlas

Authentication
- JSON Web Tokens (JWT)
- bcryptjs

Deployment
- Railway

SYSTEM ARCHITECTURE

Frontend Structure

frontend/src/
├── services/api.js
├── context/AuthContext.jsx
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── Projects.jsx
│   ├── Tasks.jsx
│   └── TeamMembers.jsx
└── components/
    ├── Layout.jsx
    └── Modal.jsx
    
Backend Structure

backend/
├── server.js
├── config/db.js
├── models/
│   ├── User.js
│   ├── Project.js
│   └── Task.js
├── routes/
│   ├── auth.js
│   ├── projects.js
│   ├── tasks.js
│   └── users.js
├── middleware/
│   ├── auth.js
│   └── error.js
└── seed.js


APPLICATION FLOW

1. User visits frontend
2. User logs in / signs up
3. Frontend sends API request
4. Backend validates credentials
5. JWT token generated
6. Token stored in localStorage
7. Protected routes verified using middleware
8. Dashboard data fetched from MongoDB


JWT AUTHENTICATION FLOW

Frontend Axios Interceptor

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

Backend JWT Middleware

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};


DATABASE DESIGN

Collections

Users
- Name
- Email
- Password
- Role

Projects
- Project Name
- Description
- Members Array

Tasks
- Title
- Description
- Status
- Deadline
- Assigned User
- Related Project


DEPLOYMENT

Railway Deployment

Frontend
- React production build using Vite
- Static file hosting

Backend
- Express.js server
- MongoDB Atlas integration
- Environment variable support


ENVIRONMENT VARIABLES

Backend .env

MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000
CORS_ORIGIN=*

Frontend .env

VITE_API_URL=https://your-backend-url.com



INSTALLATION & SETUP

Clone Repository

git clone <your-repository-url>
cd team-task-manager

Install Dependencies

Backend

cd backend
npm install

Frontend

cd frontend
npm install



RUN APPLICATION

Backend

npm run dev

Frontend

npm run dev


API ENDPOINTS

POST    /api/auth/signup      → User Registration
POST    /api/auth/login       → User Login
GET     /api/projects         → Get Projects
POST    /api/projects         → Create Project
PUT     /api/projects/:id     → Update Project
DELETE  /api/projects/:id     → Delete Project
GET     /api/tasks            → Get Tasks
POST    /api/tasks            → Create Task
PUT     /api/tasks/:id        → Update Task
DELETE  /api/tasks/:id        → Delete Task
GET     /api/users            → Get Team Members



CHALLENGES & SOLUTIONS

1. CORS Configuration

Problem:
Frontend could not communicate with backend in production.

Solution:

app.use(cors({
  origin: '*',
  credentials: true
}));

2. Production API URLs

Problem:
Hardcoded localhost URLs failed after deployment.

Solution:

baseURL: import.meta.env.VITE_API_URL

3. Token Expiry Handling

Problem:
Expired JWT tokens caused unauthorized errors.

Solution:
Axios interceptors redirect users automatically.

--------------------------------------------------

WHAT I LEARNED

- Full-Stack MERN Development
- RESTful API Design
- JWT Authentication
- MongoDB Relationships
- React Context API
- Deployment & DevOps
- Production Debugging
- Secure Authentication Practices
- Role-Based Authorization


FUTURE IMPROVEMENTS

- Refresh Token Authentication
- WebSocket Notifications
- File Uploads
- Email Notifications
- Kanban Board
- Activity Logs
- Search & Filters
- Comments System
- Unit Testing
- Integration Testing



PROJECT STATISTICS

- Lines of Code: 2000+
- REST API Endpoints: 11
- Database Collections: 3
- Major Features: 8+
- Authentication: JWT
- Deployment: Railway

--------------------------------------------------

DEMO CREDENTIALS

Email: harshith.admin@teamtask.io
Password: SecurePass@2025!

--------------------------------------------------

WHY THIS PROJECT?

This project was built to gain hands-on experience in:

- Full-stack web development
- Authentication & security
- Real-world CRUD applications
- Deployment workflows
- Team collaboration systems

It demonstrates practical industry-level concepts including scalable architecture, API development, state management, and production deployment.



AUTHOR

K Harshit Kumar Reddy

Full Stack Developer | MERN Stack Enthusiast

Email: harshithkumar.reddy08@gmail.com





FINAL NOTE

This project reflects my ability to design, develop, deploy, and manage a complete full-stack application independently while following modern development practices and clean architecture principles.

If you like this project, feel free to star the repository.
