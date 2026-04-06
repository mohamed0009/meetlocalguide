# Docker Deployment Guide

## 1. Local Docker Run

1. Copy .env.example to .env and set values.
2. Build and start all services:

```bash
docker compose up -d --build
```

1. Open services:

- Frontend: <http://localhost:3000>
- Backend API: <http://localhost:8080>
- Backend health: <http://localhost:8080/actuator/health>

1. Stop services:

```bash
docker compose down
```

## 2. GitHub Actions Image Publish

Workflow file:

- .github/workflows/docker-publish.yml

Behavior:

- Builds backend and frontend images
- Publishes to GitHub Container Registry (GHCR)
- Runs on push to main, tags starting with v, and manual dispatch

Image names:

- ghcr.io/OWNER/REPO-backend
- ghcr.io/OWNER/REPO-frontend

## 3. VPS Deployment (Future)

1. Copy .env.example to .env on your VPS and set production values.
2. Login to GHCR on VPS:

```bash
echo GITHUB_TOKEN | docker login ghcr.io -u GITHUB_USERNAME --password-stdin
```

1. Pull and start prebuilt images:

```bash
docker compose -f docker-compose.vps.yml pull
docker compose -f docker-compose.vps.yml up -d
```

Optional local PostgreSQL on VPS:

```bash
docker compose --profile with-postgres -f docker-compose.vps.yml up -d
```

## 4. Production Notes

- Always use strong APP_JWT_SECRET and database credentials.
- Keep DB_URL pointing to your production database host.
- Place a reverse proxy (Nginx/Caddy/Traefik) in front of frontend/backend for TLS.
