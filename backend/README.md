# Ledger — Backend (FastAPI + MongoDB)

A REST API providing user registration/login (JWT), and CRUD for blog posts
with ownership-based protected routes.

## Endpoints

| Method | Path                  | Auth required | Description                          |
|--------|-----------------------|----------------|---------------------------------------|
| POST   | `/api/auth/register`  | No             | Create account, returns JWT + user    |
| POST   | `/api/auth/login`     | No             | Login, returns JWT + user             |
| GET    | `/api/auth/me`        | Yes            | Get current user (used to verify token)|
| GET    | `/api/posts`          | No             | List all posts (newest first)         |
| GET    | `/api/posts/{id}`     | No             | Get a single post                     |
| POST   | `/api/posts`          | Yes            | Create a post                         |
| PUT    | `/api/posts/{id}`     | Yes (+ owner)  | Update your own post                  |
| DELETE | `/api/posts/{id}`     | Yes (+ owner)  | Delete your own post                  |
| GET    | `/api/health`         | No             | Health check                          |

## Local setup

1. **Install MongoDB** locally, or get a free cluster from
   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and copy its
   connection string.

2. **Create a virtual environment and install dependencies:**

   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   - `MONGO_URI` — your local or Atlas connection string
   - `JWT_SECRET_KEY` — replace with a long random string
     (e.g. run `python3 -c "import secrets; print(secrets.token_hex(32))"`)
   - `CORS_ORIGINS` — the URL(s) your frontend runs on, comma-separated

4. **Run the server:**

   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

   The API is now at `http://localhost:8000`. Interactive docs (Swagger UI)
   are auto-generated at `http://localhost:8000/docs`.

## Deploying

This backend is a standard ASGI app, so it deploys cleanly to most platforms.
A common free/cheap path:

### Option A: Render

1. Push this repo to GitHub.
2. Create a new **Web Service** on [Render](https://render.com), pointing at
   the `backend/` directory.
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables from `.env.example` in Render's dashboard
   (use your real Atlas `MONGO_URI` and a strong `JWT_SECRET_KEY`).
6. Set `CORS_ORIGINS` to your deployed frontend URL once you have it.

### Option B: Railway / Fly.io / any Docker host

Add a `Dockerfile`:

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Then deploy the directory as a container service, setting the same
environment variables.

### Database

Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (free tier
is enough for this project) so your deployed backend isn't dependent on a
local Mongo instance. Whitelist `0.0.0.0/0` in Atlas's network access (or your
host's specific egress IPs) so your deployed server can connect.
