# Deploying on free tiers

This is the deployment TrailVenture uses. It costs nothing, across two providers:

| Piece | Provider | Free tier |
|---|---|---|
| Web (Next.js) | Northflank | Sandbox service, always on |
| API (Django) | Northflank | Sandbox service, always on, kept private |
| Postgres | Northflank | Sandbox database |
| Redis | Upstash | Command quota per day |
| Hold expiry | Northflank cron job | Two free cron jobs |

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

**Small containers.** A Sandbox instance is `nf-compute-10`: 0.1 vCPU and 256 MB. Django with
its dependencies is roughly 150 MB resident, so the API runs a single gunicorn worker
(`WEB_CONCURRENCY=1`). Two workers exhaust the container and it is killed for running out of
memory.

The **Shell** runs inside that same container and shares the same 256 MB, so a management
command loads Django again alongside the running server. Anything heavier than a quick query —
`migrate`, `seed_catalog` — is better run as a **job**, which gets a container of its own.

## 0. Before the first public deploy

Read [the pre-deploy section of the Railway guide](deployment-railway.md#0-before-the-first-public-deploy):
the legacy key exposure and the sender-address check apply to any host.

## 1. Redis on Upstash

Create a database in the region closest to the Northflank one, and copy the `rediss://` URL. TLS
is what Django's Redis cache expects, so the URL works as-is.

## 2. Northflank project

Create a project on the **Sandbox** plan, in the region closest to your visitors. Northflank's
own terms are used below: an **addon** is a managed database, and a **combined service** builds
from a Git repository and deploys the result.

### Postgres addon

Add a **PostgreSQL** addon. When it is running, open its **Connection details** — the addon
publishes its credentials as a **secret group**, which is what the services will read rather
than you copying a password around.

### Web service

Create this one first: the API's variables reference its domain.

1. **Create new → Service → Combined service**, pointed at the repository and branch `main`.
2. Build type **Dockerfile**, **Dockerfile location** `/web/Dockerfile`, **build context** `/web`.
3. Northflank reads the port from the Dockerfile. On port **3000**, protocol HTTP, turn
   **Public** on — this is the only public entry point. Note the DNS it assigns.
4. Environment variables:

| Variable | Value |
|---|---|
| `API_ORIGIN` | `http://<api service name>:8000` |
| `PORT` | `3000` |

Services in a project reach each other as `service-name:port`, so `API_ORIGIN` is just the API
service's name. It is read per request by `web/src/proxy.ts`, so changing it needs no rebuild.

### API service

1. Another **combined service**, same repository and branch.
2. Build type **Dockerfile**, **Dockerfile location** `/api/Dockerfile`, **build context** `/api`.
3. On port **8000**, protocol HTTP, leave **Public** **off**. The service stays on the project's
   internal network and is reachable only as `<service name>:8000`.
4. Link the Postgres addon's secret group, and add the rest:

| Variable | Value |
|---|---|
| `DATABASE_URL` | from the Postgres addon's secret group |
| `REDIS_URL` | the Upstash `rediss://` URL |
| `DJANGO_SECRET_KEY` | a long random string, unique to this environment |
| `DJANGO_ALLOWED_HOSTS` | the API service's name, plus the web service's public domain |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | `https://<web public domain>` |
| `DJANGO_SECURE_SSL_REDIRECT` | `false` — TLS ends at the edge and internal traffic is plain HTTP |
| `FRONTEND_URL` | `https://<web public domain>` — Stripe's success and cancel URLs come from it |
| `CELERY_TASK_ALWAYS_EAGER` | `true` |
| `WEB_CONCURRENCY` | `1` — a second worker will not fit in 256 MB |
| `DJANGO_ADMIN_URL` | a non-obvious path, e.g. `django-admin-9f2c/` |
| `DEFAULT_FROM_EMAIL` | an address on a domain Mailjet has validated |
| `MAILJET_API_KEY`, `MAILJET_SECRET_KEY` | from Mailjet |
| `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` | from the Stripe sandbox |
| `STRIPE_WEBHOOK_SECRET` | filled in at step 3 |
| `CLOUDINARY_URL` | `cloudinary://<key>:<secret>@<cloud>` |
| `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET` | from Google Cloud |
| `GOOGLE_OAUTH_ENABLED` | `false` on a `*.code.run` domain — see step 3 |

### Migrations

Run migrations as a **job** rather than from the Shell, so they get their own memory: same
repository, **build context** `/api`, command `python manage.py migrate --noinput`. Trigger it
now and after any deploy that adds a migration. The automated equivalent is a **release flow**
with a migration node ahead of the deployment node, which is what a production project uses.

### Cron job

**Create new → Job → Cron job**, same repository, **Dockerfile location** `/api/Dockerfile` and
**build context** `/api`. Schedule `*/15 * * * *`, command `python manage.py expire_holds`.
Link the Postgres secret group and set `DJANGO_SECRET_KEY`; it needs nothing else.

## 3. After the first deploy

1. **Seed the catalog.** As a job, for the same reason: `python manage.py seed_catalog`. It uploads
   the photos to Cloudinary and is safe to re-run.
2. **Google OAuth — not available on a `*.code.run` domain.** Google only accepts a redirect URI
   whose domain is a registered public suffix. `code.run` is not on the Public Suffix List (unlike
   `vercel.app` or `onrender.com`), so it resolves to Northflank's own domain and the console
   rejects it with *"must use a domain that is a valid top private domain"*. Leave
   `GOOGLE_OAUTH_ENABLED=false` (or the credentials unset) and the sign-in button does not
   render; email and password work as normal. Attaching a custom domain makes it work, and then
   the redirect URI is `https://<your domain>/accounts/google/login/callback/`, with the consent
   screen published or your address added as a test user.
3. **Stripe webhook.** Create an endpoint at
   `https://<web public domain>/api/v1/payments/stripe/webhook/` subscribed to
   `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
   `checkout.session.expired`, `checkout.session.async_payment_failed` and `charge.refunded`. Copy
   its signing secret into `STRIPE_WEBHOOK_SECRET` and redeploy.
4. **Create your admin user.** `python manage.py createsuperuser` from the Shell — it is small
   enough to run there.

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
