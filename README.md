# My Project

This project is split into two parts:

- **Backend**: NestJS/Express API to manage the server-side logic.
- **Frontend**: React app (e.g., using Vite) for the user interface.

---

## 📁 Folder Structure

- `backend/` — API and server logic
- `frontend/` — UI and client-side code

Each folder contains its own `README.md` with setup instructions.

---

## 🚀 Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/khan-root/cortechsol-task
   ```

## 📦 Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   npm install       # Install dependencies
   npm run dev       # Start the Vite development server
   ```
   
   **Note**: Set the API Main/Base URI in the env file as shown in `.env.example.dev`

## 🛠️ Backend Setup 

1. Navigate to backend directory:
   ```bash
   cd backend
   npm install           # Install dependencies
   npm run start:dev     # Start the NestJS server in development mode
   ```
   
   **Note**: Set the port number in env file as shown in `.env.example`

## ⚙️ Prisma Setup

1. Generate Prisma client:
   ```bash
   npm run prisma:generate  # This will generate prisma files
   ```

## 🐘 PostgreSQL Database

- Database configuration is shown in `.env.example`
- Make sure PostgreSQL is running and accessible
- Update the database connection string in your environment variables
