# Ledger — Frontend (React + Vite)

A minimal, distinctive blog UI: register/login, browse posts, and
create/edit/delete your own posts once authenticated.

## Local setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env` and point `VITE_API_URL` at your backend (defaults to
`http://localhost:8000` for local development).

Run the dev server:

```bash
npm run dev
```

Visit `http://localhost:5173`.

## How auth works here

- On login/register, the backend returns a JWT and the user object.
- The JWT is stored in `localStorage` and attached as a `Bearer` token on
  every API request (see `src/api/axios.js`).
- `src/context/AuthContext.jsx` holds the current user in memory and
  re-validates the stored token against `GET /api/auth/me` on page load.
- `src/components/ProtectedRoute.jsx` redirects to `/login` if there's no
  authenticated user, and routes for creating/editing posts are wrapped in it.
- The backend separately re-checks ownership before allowing edit/delete, so
  the protected route is a UX convenience, not the real security boundary —
  that lives in the API.

## Building for production

```bash
npm run build
```

This outputs static files to `dist/`. Set `VITE_API_URL` to your deployed
backend URL before building (Vite bakes env vars in at build time).

## Deploying

Any static host works. Two simple options:

### Option A: Vercel

1. Push this repo to GitHub.
2. Import the `frontend/` directory as a new Vercel project.
3. Framework preset: Vite. Build command: `npm run build`. Output dir: `dist`.
4. Add an environment variable `VITE_API_URL` set to your deployed backend's
   URL (e.g. `https://your-api.onrender.com`).
5. Deploy.

### Option B: Netlify

1. Push this repo to GitHub.
2. New site from Git, base directory `frontend/`.
3. Build command: `npm run build`. Publish directory: `frontend/dist`.
4. Add the same `VITE_API_URL` environment variable in Netlify's dashboard.
5. Because this is a single-page app with client-side routing, add a
   `public/_redirects` file containing:
   ```
   /*  /index.html  200
   ```
   so refreshing on a route like `/posts/123` doesn't 404.

Once both are deployed, update the backend's `CORS_ORIGINS` to your frontend's
live URL.
