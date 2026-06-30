# Ledger — Full-Stack Blog with JWT Auth

A blog app with user registration/login, JWT authentication, protected
create/update/delete routes, and a React frontend.

```
blogapp/
├── backend/      FastAPI + MongoDB (Motor) — see backend/README.md
└── frontend/     React + Vite          — see frontend/README.md
```

## Quick start (local)

**1. Backend**
```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # then edit MONGO_URI and JWT_SECRET_KEY
uvicorn app.main:app --reload --port 8000
```

**2. Frontend** (in a second terminal)
```bash
cd frontend
npm install
cp .env.example .env        # defaults to http://localhost:8000, fine for local
npm run dev
```

Open `http://localhost:5173`, register an account, and start writing.

## What's implemented

- **Registration & login** — `/api/auth/register`, `/api/auth/login`,
  passwords hashed with bcrypt.
- **JWT authentication** — short-lived bearer tokens (`python-jose`),
  validated on every protected request via a FastAPI dependency.
- **Blog CRUD** — anyone can read posts; only the logged-in author can
  create, edit, or delete their own posts (enforced server-side, not just
  hidden in the UI).
- **Protected routes** — both server-side (`get_current_user` dependency +
  ownership checks) and client-side (`ProtectedRoute` component that
  redirects unauthenticated users to `/login`).

## Deploying

Each app deploys independently — see `backend/README.md` and
`frontend/README.md` for platform-specific steps (Render/Railway for the
API, Vercel/Netlify for the frontend, MongoDB Atlas for the database).
After both are live, set the backend's `CORS_ORIGINS` to the frontend's URL
and the frontend's `VITE_API_URL` to the backend's URL, then redeploy the
frontend so the new env var is baked into the build.
