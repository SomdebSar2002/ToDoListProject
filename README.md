# 📝 ToDo List App (React + Supabase)

A secure and modern **task management web application** built using **React and Vite**, powered by **Supabase** for authentication and database storage. Users can sign up, log in, and manage their personal to-do lists with persistent cloud storage.

---

## 🔁 Application Demo

![ToDo App Demo](./ToDoListProject.gif)

This demo shows:
- User login & signup  
- Adding new tasks  
- Marking tasks as completed  
- Deleting tasks  
- Real-time updates synced with Supabase  

---

## ✨ Features

- 🔐 Secure authentication using **Supabase Auth**
- 📝 Create, complete, and delete tasks
- 🗄️ Tasks stored in a **Supabase PostgreSQL database**
- 👤 Each user sees only their own tasks
- ⚡ Fast, responsive UI built with **React + Vite**
- 📱 Clean and simple design

---

## 🛠 Tech Stack

| Layer | Technology |
|------|-----------|
| Frontend | React, Vite |
| Backend | Supabase |
| Authentication | Supabase Auth |
| Database | PostgreSQL (Supabase) |
| Styling | CSS |
| Build Tool | Vite |

---

## 🧠 How It Works

1. Users authenticate via **Supabase Auth**
2. After login, tasks are fetched from Supabase
3. Users can add, update, and delete tasks
4. All changes are stored instantly in the cloud
5. The UI updates automatically

---

## 🚀 Run Locally

 ### 1️⃣ Clone the repository
bash
git clone https://github.com/SomdebSar2002/ToDoListProject
cd ToDoListProject
### 2️⃣ Install dependencies
bash
Copy code
npm install
    ### 3️⃣ Create a Supabase Project

Go to https://supabase.com
-Create a new project
-Create a todos table with:
  -id
  -user_id
  task
  is_completed

Enable Row Level Security (RLS) so users only see their own tasks

### 4️⃣ Add environment variables
  Create a .env file:
  ini
  Copy code
  VITE_SUPABASE_URL=your_project_url
  VITE_SUPABASE_ANON_KEY=your_anon_key
### 5️⃣ Start the app
  bash
  Copy code
  npm run dev
  Open http://localhost:5173 in your browser.

### 📌 What This Project Shows
  Real-world React application structure
  Supabase authentication & database usage
  Full CRUD operations
  Cloud backend integration
  Clean UI and UX

### 🔮 Future Improvements
  Task filters (Completed / Pending)
  Due dates & priorities
  Dark mode
  Team-based shared lists
