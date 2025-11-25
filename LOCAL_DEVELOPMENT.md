# AzharStore Local Development Guide

## Prerequisites

- **Backend**: Python 3.9+, pip
- **Frontend**: Node.js 18+, npm
- **Database**: Supabase account (or local PostgreSQL)

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# Admin Credentials
AZHAR_ADMIN_EMAIL=admin@example.com
AZHAR_ADMIN_INITIAL_PASSWORD=your_secure_password

# JWT Secret (generate with: openssl rand -hex 32)
SECRET_KEY=your_super_secret_key_here

# Optional: Additional CORS origins
CORS_ORIGINS=
```

### 3. Start Backend Server

**Option 1: Using Docker (Recommended - matches production)**

```bash
# From backend directory
docker build -t azharstore-backend .
docker run -p 8000:8000 --env-file .env azharstore-backend
```

**Option 2: Direct Python (for development)**

```bash
# From backend directory
uvicorn main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`

**Verify it's running:**
- Visit `http://localhost:8000/health` - should return `{"status": "healthy"}`
- Visit `http://localhost:8000/docs` - interactive API documentation

---

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables (Optional)

If you want to use a **local backend**, create a `.env` file in the `frontend` directory:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Point to local backend
VITE_API_BASE_URL=http://localhost:8000/api
```

**Note**: If you don't create a `.env` file, the frontend will use the production API at `https://api.azhar.store/api` by default.

### 3. Start Frontend Dev Server

```bash
# From frontend directory
npm run dev
```

Frontend will be available at: `http://localhost:3000`

---

## Accessing the Admin Panel Locally

### Option 1: Using Path-Based Routing (Recommended for Local Dev)

Navigate to: `http://localhost:3000/admin`

This will show the admin login page.

### Option 2: Using Hostname-Based Routing

If you want to test the production-like hostname routing locally, add this to your hosts file:

**Windows**: `C:\Windows\System32\drivers\etc\hosts`
**Mac/Linux**: `/etc/hosts`

```
127.0.0.1 admin.localhost
```

Then navigate to: `http://admin.localhost:3000`

---

## Common Development Workflows

### Full Local Development (Frontend + Backend)

**With Docker:**
1. Start backend: `cd backend && docker build -t azharstore-backend . && docker run -p 8000:8000 --env-file .env azharstore-backend`
2. Create `frontend/.env` with `VITE_API_BASE_URL=http://localhost:8000/api`
3. Start frontend: `cd frontend && npm run dev`
4. Access admin at: `http://localhost:3000/admin`

**Without Docker:**
1. Start backend: `cd backend && uvicorn main:app --reload --port 8000`
2. Create `frontend/.env` with `VITE_API_BASE_URL=http://localhost:8000/api`
3. Start frontend: `cd frontend && npm run dev`
4. Access admin at: `http://localhost:3000/admin`

### Frontend Only (Using Production Backend)

1. Don't create `frontend/.env` (or leave `VITE_API_BASE_URL` commented out)
2. Start frontend: `cd frontend && npm run dev`
3. Access admin at: `http://localhost:3000/admin`
4. Frontend will connect to production API

---

## Troubleshooting

### CORS Errors

**Problem**: Console shows CORS errors when making API requests.

**Solution**: 
- Ensure backend is running on `http://localhost:8000`
- Check that `frontend/.env` has `VITE_API_BASE_URL=http://localhost:8000/api`
- Verify backend `config.py` includes `http://localhost:3000` in `essential_origins`

### Admin Panel Not Loading

**Problem**: Navigating to `/admin` redirects to home.

**Solution**:
- Ensure you're using `http://localhost:3000/admin` (not just `/admin`)
- Check browser console for JavaScript errors
- Verify `App.jsx` has the dual routing logic

### Backend Connection Failed

**Problem**: Frontend can't connect to backend.

**Solution**:
- Verify backend is running: `curl http://localhost:8000/health`
- Check `VITE_API_BASE_URL` in `frontend/.env`
- Restart frontend dev server after changing `.env` files

### Database Connection Issues

**Problem**: Backend fails to start with database errors.

**Solution**:
- Verify `SUPABASE_URL` and `SUPABASE_KEY` in `backend/.env`
- Check Supabase project is active and accessible
- Ensure database tables are created (check `db.sql` for migrations)

---

## Production Deployment

### Frontend Build

```bash
cd frontend
npm run build
```

The `dist` folder will contain the production build.

**Important**: Production builds will use `https://api.azhar.store/api` unless you set `VITE_API_BASE_URL` during build time.

### Backend Deployment

The backend is deployed on Dokploy. Ensure environment variables are configured in the Dokploy dashboard.

---

## Security Notes

- **Never commit `.env` files** - they contain sensitive credentials
- **Admin panel access in production**:
  - `admin.azhar.store` - IP-restricted via Cloudflare (your IP only)
  - `beta.azhar.store/admin` - Blocked by code, redirects to home
- **Local development** - Admin accessible at `localhost:3000/admin` for testing
