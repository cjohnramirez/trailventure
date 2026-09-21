# Deploying to Railway

Architecture and reasoning are in [ADR 0002](adr/0002-host-on-railway.md).

## 0. Before the first public deploy

**Revoke the credentials still in git history.** The first version of the site committed
`backend/.env` in March 2025. It is gone from every branch tip, but it stays reachable through
the `legacy-v1` tag and the commits before it, so anyone who clones the repository can read it.
Two values are exposed, neither of them in use today:

| Value | Risk | Action |
|---|---|---|
| A Stripe **test** secret key (`sk_test_51Qvhbi…`) | Test mode only, and on a different Stripe account than the one configured now, so no real money is reachable. It can still read and write that account's test data. | Roll it in the old account's dashboard, or delete the account. |
| The legacy Django `SECRET_KEY` | Signed that deployment's sessions and password-reset tokens. The rebuild generates its own. | Nothing to do beyond never reusing it. |

No Cloudinary, Mailjet or Google credentials were ever committed — those services arrived with
the rebuild, and their keys live only in a gitignored `.env`.

**Check the sender address.** `manage.py check --deploy` fails when `DEFAULT_FROM_EMAIL` still
uses a placeholder domain, because Mailjet only delivers from an address the account has
validated. Run it with the production settings before deploying.

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
