# Artisan Marketplace

Monorepo: one **frontend** (buyer + seller) and one **backend**.

## Structure

- **`frontend/`** – Single React app (Vite). Buyer: marketplace and product detail. Seller: sell landing, upload product (photos, voice, AI chat, listing preview). Shared auth and routing.
- **`backend/`** – Node API (auth, products, upload/AI listing).

## Setup

```bash
# Install all
npm run install:all

# Or manually
npm install
cd frontend && npm install
cd ../backend && npm install
```

## Run

**Terminal 1 – Backend**
```bash
npm run dev:backend
# or: npm run backend
```

**Terminal 2 – Frontend**
```bash
npm run dev
```

- Frontend: http://localhost:3000 (API proxied to backend)
- Backend: http://localhost:3001

## Build

```bash
npm run build
# Builds frontend into frontend/dist
```

## Env

- **Backend:** `backend/.env` (see `backend/.env.example` if present).
- **Frontend:** optional `frontend/.env` with `VITE_API_URL` for production API base; dev uses Vite proxy to `/api`.
