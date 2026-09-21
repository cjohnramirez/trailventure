# Deploying on free tiers

This is the deployment TrailVenture uses. It costs nothing, across four providers:

| Piece | Provider | Free tier |
|---|---|---|
| Web (Next.js) | Vercel | Hobby, non-commercial |
| API (Django) | Render | Web service, sleeps after ~15 minutes idle |
| Postgres | Neon | Autosuspends when idle |
| Redis | Upstash | Command quota per day |

[ADR 0002](adr/0002-host-on-railway.md) records the alternative: everything on Railway for about
US$5–10 a month, with private networking and real background processes. The code runs on either;
what changes is configuration, not architecture.

## What the free tier gives up

**No always-on process.** There is no Celery worker and no beat, so:

- `CELERY_TASK_ALWAYS_EAGER=true` runs tasks inside the request. A verification email adds a few
  hundred milliseconds to signing up.
- Payment-hold expiry moves to `.github/workflows/cron.yml`, which posts to
  `/api/v1/bookings/expire-holds/` every 15 minutes with a shared key. That request also keeps the
  API awake, which is what stops a visitor meeting a cold start.

Hold expiry is housekeeping either way: `Booking.is_hold_active` is computed from the timestamp and
checkout refuses an expired hold on its own, so the worst a missed run causes is a booking still
labelled "awaiting payment".

**Cold starts.** A sleeping Render service takes 30–60 seconds to answer, and a suspended Neon
branch adds a second or two on top. Warm, both are fast enough that the difference from a paid tier
is not visible. The cron job above is what keeps them warm; if you disable it, expect the first
visit after a quiet period to be slow.

**Public API.** There is no private network between providers, so the API is reachable on the
internet. `DJANGO_ALLOWED_HOSTS`, CSRF trusted origins and session cookies are what protect it, and
the browser still only ever talks to the web domain.

## 0. Before the first public deploy

Read [the pre-deploy section of the Railway guide](deployment-railway.md#0-before-the-first-public-deploy):
the legacy key exposure and the sender-address check apply to any host.

## 1. Postgres on Neon

1. Create a project, choosing the region closest to your visitors.
2. Copy the pooled connection string. It ends in `-pooler` and is the one to use; a serverless host
   opens and drops connections constantly.
3. Keep it for `DATABASE_URL` below.

## 2. Redis on Upstash

1. Create a database in the same region as the API.
2. Copy the `rediss://` URL — TLS, which Django's Redis cache understands as-is.

## 3. API on Render

1. New **Web Service** from the repository, root directory `api`, runtime **Docker**.
2. Instance type **Free**. Health check path `/api/v1/health/`.
3. Pre-deploy command: `python manage.py migrate --noinput`.
4. Environment variables:

| Variable | Value |
|---|---|
| `DJANGO_SECRET_KEY` | a long random string, unique to this environment |
| `DATABASE_URL` | the Neon pooled connection string |
| `REDIS_URL` | the Upstash `rediss://` URL |
| `DJANGO_ALLOWED_HOSTS` | `<api>.onrender.com,<web>.vercel.app` |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | `https://<web>.vercel.app` |
| `DJANGO_SECURE_SSL_REDIRECT` | `false` — Render terminates TLS, and its health check would otherwise loop |
| `FRONTEND_URL` | `https://<web>.vercel.app` — Stripe's success and cancel URLs come from it |
| `CELERY_TASK_ALWAYS_EAGER` | `true` |
| `CRON_SECRET` | a long random string, also stored as a repository secret |
| `DJANGO_ADMIN_URL` | a non-obvious path, e.g. `django-admin-9f2c/` |
| `DEFAULT_FROM_EMAIL` | an address on a domain Mailjet has validated |
| `MAILJET_API_KEY`, `MAILJET_SECRET_KEY` | from Mailjet |
| `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` | from the Stripe sandbox |
| `STRIPE_WEBHOOK_SECRET` | filled in at step 6 |
| `CLOUDINARY_URL` | `cloudinary://<key>:<secret>@<cloud>` |
| `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET` | from Google Cloud |

## 4. Web on Vercel

1. Import the repository, root directory `web`, framework **Next.js**.
2. Environment variable `API_ORIGIN` = `https://<api>.onrender.com`.

`API_ORIGIN` is read per request by `web/src/proxy.ts`, so it is a runtime variable. Changing it
does not need a rebuild.

## 5. Scheduled jobs

In the repository settings add the variable `API_URL` (`https://<api>.onrender.com`) and the secret
`CRON_SECRET`, matching the API's. `.github/workflows/cron.yml` skips itself until `API_URL` is
set. Run it once by hand from the Actions tab to confirm it returns `{"expired": 0}`.

## 6. After the first deploy

1. **Seed the catalog.** From the Render shell: `python manage.py seed_catalog`. It uploads the
   photos to Cloudinary and is safe to re-run.
2. **Google OAuth.** Add `https://<web>.vercel.app/accounts/google/login/callback/` to the client's
   authorized redirect URIs, and publish the consent screen — an unverified app only works for
   accounts listed as testers.
3. **Stripe webhook.** Create an endpoint at
   `https://<web>.vercel.app/api/v1/payments/stripe/webhook/` subscribed to
   `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
   `checkout.session.expired`, `checkout.session.async_payment_failed` and `charge.refunded`. Copy
   its signing secret into `STRIPE_WEBHOOK_SECRET` and redeploy.
4. **Create your admin user.** `python manage.py createsuperuser`.

## 7. Verify

- `https://<web>.vercel.app/api/v1/health/` returns `{"status":"ok","database":"ok","cache":"ok"}`,
  which proves the proxy, Neon and Upstash are all reachable.
- The home page lists destinations, with photos served from Cloudinary.
- A booking reaches Stripe Checkout, and paying with `4242 4242 4242 4242` flips the success page
  from "Confirming your payment" to "Booking Successful!" once the webhook lands.
- Signing up delivers a verification code.
- The Actions tab shows the scheduled job succeeding.
