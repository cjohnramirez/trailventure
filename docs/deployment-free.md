# Deploying on free tiers

This is the deployment TrailVenture uses. It costs nothing, across two providers:

| Piece | Provider | Free tier |
|---|---|---|
| Web (Next.js) | Northflank | Sandbox service, always on |
| API (Django) | Northflank | Sandbox service, always on, kept private |
| Postgres | Northflank | Sandbox database |
| Redis | Upstash | Command quota per day |
| Hold expiry | Northflank cron | Two free cron jobs |

Northflank's Sandbox tier gives two services, one database and two cron jobs, and does not sleep,
so there are no cold starts. It does require a card on file even though nothing is charged, and
Northflank describes Sandbox as a tier for evaluating the platform — treat it as something that
could change, and keep [the Railway guide](deployment-railway.md) in mind as the paid fallback.
[ADR 0002](adr/0002-host-on-railway.md) records why.

Only the web service gets a public domain. The API stays on Northflank's internal network, which
is the arrangement `docs/architecture.md` describes: the browser only ever talks to one origin, and
`web/src/proxy.ts` forwards Django's paths from there.

## What the free tier gives up

**No always-on worker.** There is no Celery worker and no beat process, so:

- `CELERY_TASK_ALWAYS_EAGER=true` runs tasks inside the request. A verification email adds a few
  hundred milliseconds to signing up.
- Payment-hold expiry runs as a Northflank cron job calling `python manage.py expire_holds`.

Hold expiry is housekeeping either way: `Booking.is_hold_active` is computed from the timestamp and
checkout refuses an expired hold on its own, so a missed run only leaves a booking still labelled
"awaiting payment".

**Small containers.** Sandbox services are modest, so the API runs fewer gunicorn workers
(`WEB_CONCURRENCY=2`). If the API restarts under memory pressure, drop it to 1.

## 0. Before the first public deploy

Read [the pre-deploy section of the Railway guide](deployment-railway.md#0-before-the-first-public-deploy):
the legacy key exposure and the sender-address check apply to any host.

## 1. Redis on Upstash

Create a database in the region closest to the Northflank one, and copy the `rediss://` URL. TLS
is what Django's Redis cache expects, so the URL works as-is.

## 2. Northflank project

Create a project on the **Sandbox** plan, in the region closest to your visitors.

### Postgres

Add a **PostgreSQL** addon. Once it is running, copy its **internal** connection string — the
services reach it without going over the internet.

### API service

1. New **service** → **Build and deploy from a repository**, branch `main`.
2. Build type **Dockerfile**, build context `/api`, Dockerfile path `/api/Dockerfile`.
3. Port **8000**, protocol HTTP, and leave it **without a public domain**.
4. Health check path `/api/v1/health/`.
5. Environment variables:

| Variable | Value |
|---|---|
| `DJANGO_SECRET_KEY` | a long random string, unique to this environment |
| `DATABASE_URL` | the Postgres addon's internal connection string |
| `REDIS_URL` | the Upstash `rediss://` URL |
| `DJANGO_ALLOWED_HOSTS` | the API's internal hostname, plus the web service's public domain |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | `https://<web public domain>` |
| `DJANGO_SECURE_SSL_REDIRECT` | `false` — TLS ends at the edge and internal traffic is plain HTTP |
| `FRONTEND_URL` | `https://<web public domain>` — Stripe's success and cancel URLs come from it |
| `CELERY_TASK_ALWAYS_EAGER` | `true` |
| `WEB_CONCURRENCY` | `2` |
| `DJANGO_ADMIN_URL` | a non-obvious path, e.g. `django-admin-9f2c/` |
| `DEFAULT_FROM_EMAIL` | an address on a domain Mailjet has validated |
| `MAILJET_API_KEY`, `MAILJET_SECRET_KEY` | from Mailjet |
| `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` | from the Stripe sandbox |
| `STRIPE_WEBHOOK_SECRET` | filled in at step 5 |
| `CLOUDINARY_URL` | `cloudinary://<key>:<secret>@<cloud>` |
| `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET` | from Google Cloud |

Migrations run before each release: set the release command to
`python manage.py migrate --noinput`.

### Web service

1. New **service** → same repository, build context `/web`, Dockerfile path `/web/Dockerfile`.
2. Port **3000**, and **generate a public domain** — this is the only public entry point.
3. Environment variables: `API_ORIGIN` = `http://<api internal hostname>:8000`, and `PORT` = `3000`.

`API_ORIGIN` is read per request by `web/src/proxy.ts`, so changing it does not need a rebuild.

### Cron job

Add a **cron job** from the same repository and Dockerfile as the API, schedule `*/15 * * * *`,
command `python manage.py expire_holds`. Give it the same `DATABASE_URL` and `DJANGO_SECRET_KEY`;
it needs nothing else.

## 3. After the first deploy

1. **Seed the catalog.** From the API service's shell: `python manage.py seed_catalog`. It uploads
   the photos to Cloudinary and is safe to re-run.
2. **Google OAuth.** Add `https://<web public domain>/accounts/google/login/callback/` to the
   client's authorized redirect URIs, and publish the consent screen — an unverified app only works
   for accounts listed as testers.
3. **Stripe webhook.** Create an endpoint at
   `https://<web public domain>/api/v1/payments/stripe/webhook/` subscribed to
   `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
   `checkout.session.expired`, `checkout.session.async_payment_failed` and `charge.refunded`. Copy
   its signing secret into `STRIPE_WEBHOOK_SECRET` and redeploy.
4. **Create your admin user.** `python manage.py createsuperuser`.

## 4. Verify

- `https://<web public domain>/api/v1/health/` returns `{"status":"ok","database":"ok","cache":"ok"}`,
  which proves the proxy, Postgres and Upstash are all reachable.
- The home page lists destinations, with photos served from Cloudinary.
- A booking reaches Stripe Checkout, and paying with `4242 4242 4242 4242` flips the success page
  from "Confirming your payment" to "Booking Successful!" once the webhook lands.
- Signing up delivers a verification code.
- The cron job's first run logs `Expired 0 stale booking hold(s).`

## Hosts without a scheduler

Somewhere with no cron (a free Render service, say), `.github/workflows/cron.yml` does the same job
over HTTP: it posts to `/api/v1/bookings/expire-holds/` with a shared `CRON_SECRET`, which also
keeps a sleeping service awake. Set the repository variable `API_URL` and the secret `CRON_SECRET`
to enable it; it skips itself until then. On Northflank it is redundant — the cron job is enough.
