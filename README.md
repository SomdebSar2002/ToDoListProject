# 📝 ToDo List App (React + Supabase)

A secure task manager built with **React + Vite** and **Supabase**. Users can sign up, sign in, and manage their own to-do items with real-time updates and server-side protections.

## 🔁 Demo

![ToDo App Demo](./ToDoListProject.gif)

## ✨ Features

- 🔐 Supabase Auth for sign-up/sign-in
- ✅ Create, complete, edit, and delete tasks
- 👤 Per-user task isolation
- ⚡ Real-time updates via Supabase changes
- 🛡️ Triggers + stricter RLS policies for safer writes

## 🛠 Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React, Vite |
| Backend | Supabase |
| Auth | Supabase Auth |
| Database | PostgreSQL (Supabase) |
| Styling | CSS |

## 🧠 How It Works

1. Users authenticate via Supabase Auth.
2. Tasks are fetched for the signed-in user only.
3. CRUD actions write to Supabase and sync in real time.
4. Row Level Security (RLS) enforces data isolation.

## 🗄️ Database Notes

This project uses a two-layer data model:

### 1) `users` profile table

Stores the app-visible user data created from Supabase Auth:
- `id` (uuid, primary key, equals `auth.uid()`)
- `email` (text)
- `name` (text)

### 2) `todolists` table

Stores the actual tasks and links back to the profile table:
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to `users.id`)
- `list` (text)
- `checked` (boolean)
- `email` (text)
- `name` (text)
- `created_at` / `updated_at` (timestamptz)

### Triggers

Triggers are used to connect the layers and keep data consistent:
- Create or sync the `users` row from Auth on sign-up.
- Set `todolists.user_id` from `auth.uid()` on insert.
- Maintain `updated_at` on update.

### RLS Policies (Stricter)

RLS is enforced so only the logged-in user (session `auth.uid()`) can read or write their rows:
- `select` where `user_id = auth.uid()`
- `insert` where `user_id = auth.uid()`
- `update` where `user_id = auth.uid()`
- `delete` where `user_id = auth.uid()`

## 🚀 Run Locally

### 1) Clone
```bash
git clone https://github.com/SomdebSar2002/ToDoListProject
cd ToDoListProject
```

### 2) Install
```bash
npm install
```

### 3) Configure Supabase

Create a Supabase project and ensure:
- Auth is enabled
- `todolists` table exists
- RLS + policies are configured
- Triggers are created for `user_id` and `updated_at`

### 4) Add env vars
Create `.env.local`:
```ini
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 5) Start
```bash
npm run dev
```
Open `http://localhost:5173`.

## 📌 What This Project Shows

- Real-world React app structure
- Supabase auth + database integration
- Full CRUD with strict RLS
- Real-time syncing

## 🔮 Future Improvements

- Filters (Completed / Pending)
- Due dates and priorities
- Dark mode
- Shared lists
