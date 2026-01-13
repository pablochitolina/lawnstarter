# LawnStarter

A full-stack application to search the Star Wars API, built with **Laravel 11** (Backend) and **React + Vite** (Frontend), orchestrated via **Docker**.

## Features
- **Search**: Search for People or Movies using the Star Wars API.
- **Statistics**: Tracks search queries and computes stats (Top Terms, Avg Duration, Popular Hour) every 5 minutes.
- **Caching**: SWAPI responses are cached for 1 hour; Stats are cached for 10 minutes.
- **Responsive UI**: Pixel-perfect implementation matching Zeplin mocks (approx).

## Prerequisites
- Docker & Docker Compose
- Space for Docker images (~500MB)

## Quick Start

1. **Boot Application**
   ```bash
   docker-compose up -d --build
   ```
   > First boot may take a minute for containers to initialize and Nginx to be ready.

2. **Access**
   - **App**: [http://localhost:8080](http://localhost:8080)
   - **API Search**: `http://localhost:8080/api/search?q=luke&type=people`
   - **API Stats**: `http://localhost:8080/api/stats`

3. **Shutdown**
   ```bash
   docker-compose down
   ```

## Testing
### Backend (Laravel)
```bash
docker-compose exec server php artisan test
```

### Frontend (Vitest)
```bash
docker-compose exec client npm run test
```

## Architecture Decisions

### Stack
- **Frontend**: React (TS) + Vite. simple, fast, modern. React Query handles async state. Tailwind CSS handles styling relative to Mocks.
- **Backend**: Laravel 11. Robust, handles Queues/Scheduling natively.
- **Infrastructure**: Nginx reverse proxy unifies `client` (5173) and `server` (9000) under port 8080.

### Statistics Implementation
1. User searches -> **LogSearchQuery** Job dispatched -> Saved to `search_queries` table (SQLite).
2. **Schedule**: `stats:compute` command runs every 5 minutes.
3. **Compute**: Aggregates data from SQLite, caches result to Redis (`search_stats` key).
4. **Endpoint**: `GET /api/stats` serves from Redis (extremely fast).

### Docker
- `server`: PHP 8.2 FPM + Redis/SQLite extensions.
- `worker`: Runs `php artisan queue:work`.
- `scheduler`: Runs `php artisan schedule:work`.
- `client`: Node 20 + Vite Dev Server.
- `nginx`: Reverse proxy.
- `redis`: Shared cache/queue.

## Troubleshooting
- **500 Error?**: Check `docker-compose logs server`. often permissions. `docker-compose exec server chmod -R 777 storage`.
- **Vite Error?**: Ensure Node 20+ image is used (configured in compose).
