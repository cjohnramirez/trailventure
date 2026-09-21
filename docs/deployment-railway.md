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
| `DJANGO_SECRET_KEY` | a long random string, unique to this environment |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `REDIS_URL` | `${{Redis.REDIS_URL}}` |
| `DJANGO_ALLOWED_HOSTS` | `${{api.RAILWAY_PRIVATE_DOMAIN}},${{web.RAILWAY_PUBLIC_DOMAIN}}` |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | `https://${{web.RAILWAY_PUBLIC_DOMAIN}}` |
| `DJANGO_SECURE_SSL_REDIRECT` | `false` (TLS ends at Railway's edge, and private traffic is plain HTTP) |
| `FRONTEND_URL` | `https://${{web.RAILWAY_PUBLIC_DOMAIN}}` — Stripe's success and cancel URLs are built from it |
| `DJANGO_ADMIN_URL` | a non-obvious path for Django admin, e.g. `django-admin-9f2c/` |
| `DEFAULT_FROM_EMAIL` | `TrailVenture <no-reply@yourdomain>` on a domain Mailjet has validated |
| `MAILJET_API_KEY`, `MAILJET_SECRET_KEY` | from Mailjet; both must be set or mail falls back to SMTP |
| `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` | from the Stripe sandbox |
| `STRIPE_WEBHOOK_SECRET` | the signing secret of the endpoint created in step 4 |
| `CLOUDINARY_URL` | `cloudinary://<key>:<secret>@<cloud>` |
| `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET` | from Google Cloud; without them the sign-in button is hidden |

`CELERY_TASK_ALWAYS_EAGER` must stay unset in production, or the worker is bypassed and
emails block the request.

**`web`**

| Variable | Value |
|---|---|
| `API_ORIGIN` | `http://${{api.RAILWAY_PRIVATE_DOMAIN}}:8000` |
| `PORT` | `3000` |

`API_ORIGIN` is read at request time by `web/src/proxy.ts`, so it is a runtime variable, not a
build argument.

## 3. After the first deploy

1. **Seed the catalog.** From the `api` service shell:
   `python manage.py seed_catalog` — it uploads the photos to Cloudinary and is safe to re-run.
2. **Google OAuth.** Add `https://<web domain>/accounts/google/login/callback/` to the client's
   authorized redirect URIs, and publish the consent screen (an unverified app only works for
   accounts listed as testers).
3. **Stripe webhook.** Create an endpoint at
   `https://<web domain>/api/v1/payments/stripe/webhook/` subscribed to
   `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
   `checkout.session.expired`, `checkout.session.async_payment_failed` and `charge.refunded`.
   Copy its signing secret into `STRIPE_WEBHOOK_SECRET` and redeploy.
4. **Create your admin user.** `python manage.py createsuperuser`.

## 4. Verify a deploy
- **API:** the deploy log shows `migrate` finishing, and the health check `/api/v1/health/` returns `{"status":"ok","database":"ok","cache":"ok"}`.
- **Web:** `https://<web domain>/` loads, and `https://<web domain>/api/v1/health/` reaches Django through the proxy.
- **Worker:** logs show `celery@... ready`.
