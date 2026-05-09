Team Task Manager MERN

A full-stack team task management application built with React and Tailwind frontend, Node Express and MongoDB backend, featuring JWT authentication and role-based access control.

Project Structure

backend folder contains Express API and Mongoose models
frontend folder contains React with Vite, Tailwind CSS, React Router and Axios

Getting Started Locally

Backend Setup

Navigate to the backend folder
Copy the env.example file to env and add your MongoDB connection string and JWT secret
Run npm install to install dependencies
Run npm run seed to create demo users and sample data if needed
Run npm run dev to start the development server
The backend will run on http://localhost:5000

Frontend Setup

Navigate to the frontend folder
Copy the env.example file to env and set VITE_API_URL to http://localhost:5000/api
Run npm install to install dependencies
Run npm run dev to start the development server
The frontend will run on http://localhost:5173

Demo Accounts

After running the seed command, you can use these accounts

Admin account with email admin@demo.com and password password123
Member account with email member@demo.com and password password123

Deployment on Railway

The application can be deployed to Railway by setting up two separate services from the same repository.

Backend Service Configuration

Set the root directory to backend
Set build command to npm install
Set start command to npm start
Configure these environment variables

MONGO_URI for your MongoDB Atlas connection string
JWT_SECRET as a long random string for token signing
PORT which Railway sets automatically
CORS_ORIGIN as your frontend URL such as https://your-frontend.up.railway.app

Frontend Service Configuration

Set the root directory to frontend
Set build command to npm install and npm run build
Set start command to npm run preview with host 0.0.0.0 and port PORT
Configure these environment variables

VITE_API_URL as your backend URL with /api appended, for example https://your-backend.up.railway.app/api

A railway.json file is included in each folder for configuration.

API Endpoints

Authentication endpoints

POST /api/auth/signup for user registration
POST /api/auth/login for user login
GET /api/auth/me to get current user information

Project endpoints

GET /api/projects to retrieve all projects
POST /api/projects to create a new project, admin only
PUT /api/projects/:id to update a project, admin only
DELETE /api/projects/:id to delete a project, admin only

Task endpoints

GET /api/tasks to retrieve all tasks
POST /api/tasks to create a new task, admin only
PUT /api/tasks/:id to update a task, admin or assignee for status changes
DELETE /api/tasks/:id to delete a task, admin only

User endpoints

GET /api/users to retrieve the list of team members, admin only
