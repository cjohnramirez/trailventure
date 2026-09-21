# Deploying to Railway

Architecture and reasoning are in [ADR 0002](adr/0002-host-on-railway.md).

## 1. Create the project
1. **New project from the repo.** In Railway, create a project from `cjohnramirez/trailventure`.
2. **Databases.** Add a **PostgreSQL** and a **Redis** database.
3. **Services.** Add four services from the same repo. Set the root directory and config file path for each:

| Service | Root directory | Config file |
|---|---|---|
| `web` | `/web` | `/web/railway.web.json` |
| `api` | `/api` | `/api/railway.api.json` |
| `worker` | `/api` | `/api/railway.worker.json` |
| `beat` | `/api` | `/api/railway.beat.json` |

4. **Deploy branch.** Point production at `main`. An optional staging environment can follow `dev`.
5. **Domains.** Generate a public domain for `web` only. `api`, `worker` and `beat` stay private.

## 2. Variables
Use Railway reference variables so credentials never get copied by hand.

**`api`, `worker`, `beat` (shared)**

| Variable | Value |
|---|---|
| `DJANGO_SECRET_KEY` | a long random string |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `REDIS_URL` | `${{Redis.REDIS_URL}}` |
| `DJANGO_ALLOWED_HOSTS` | `${{api.RAILWAY_PRIVATE_DOMAIN}},${{web.RAILWAY_PUBLIC_DOMAIN}}` |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | `https://${{web.RAILWAY_PUBLIC_DOMAIN}}` |
| `DJANGO_SECURE_SSL_REDIRECT` | `false` (TLS ends at Railway's edge, and private traffic is plain HTTP) |

Later milestones add Stripe, Mailjet, Cloudinary and Google OAuth keys. Each one is listed in `api/.env.example` when its milestone introduces it.

**`web`**

| Variable | Value |
|---|---|
| `API_ORIGIN` | `http://${{api.RAILWAY_PRIVATE_DOMAIN}}:8000` |
| `PORT` | `3000` |

## 3. Verify a deploy
- **API:** the deploy log shows `migrate` finishing, and the health check `/api/v1/health/` returns `{"status":"ok","database":"ok","cache":"ok"}`.
- **Web:** `https://<web domain>/` loads, and `https://<web domain>/api/v1/health/` reaches Django through the proxy.
- **Worker:** logs show `celery@... ready`.
