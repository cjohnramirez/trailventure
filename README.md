# TrailVenture

> **Early access.** TrailVenture is a portfolio project that is still being built. Trips, hosts and reviews are demo data, and all payments run in Stripe test mode, so no real money is charged.

TrailVenture is a tour-package booking site for trips across the Philippines and beyond. Travelers search packages by destination, date and budget, compare tiers and itineraries, book, and pay with Stripe.

## Status

The project is being rebuilt from its first version, a Vite SPA and a Django API on Vercel. That version's code is preserved in git history under the `legacy-v1` tag. The rebuild follows [the design spec](docs/specs/2026-09-17-rebuild-design.md) in two phases:

- **Phase A (in progress): parity.** Everything the first version did, rebuilt on a secure stack in the same visual design. That covers search, package pages, booking with Stripe Checkout, reviews, the account page, and sign-in with email verification and Google.
- **Phase B: new features.** Host and admin roles, departures with seat capacity, cancellations and refunds, a security page with 2FA, a wishlist, and itinerary maps.

This README only lists what exists today:

| Area    | Implemented                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API     | Django 5.2 project, health check (database + Redis), OpenAPI docs; catalog of destinations, packages, tiers and itineraries with search filters (destination, dates, price, rating), pagination and Redis-cached reads; accounts with email + password, 6-digit email verification and password-reset codes (sent via Mailjet, Celery), Google sign-in, rate limits in Redis, and a server-controlled `role`; bookings priced entirely on the server, held for 30 minutes and paid through Stripe Checkout, with a signature-checked webhook that ignores repeated events and a Celery task that expires unpaid holds; traveler profiles with Cloudinary photo uploads signed for direct browser upload, and reviews that only a paid booking whose trip has started can leave, one per booking |
| Web     | Original TrailVenture look (theme, logo, header with search pill, footer, early-access notices) on a standardized type and icon scale; home page (hero, featured destinations, choose us), search page with filters, package page with tiers and itinerary, About page; login, register, email verification, forgot/reset password, Google sign-in and a signed-in account page; booking card on the package page (a bottom bar and drawer on phones), booking review page with the live invoice, and the success and cancelled pages                                                                                 |
| Tooling | Docker images for web and API, Railway service configs, CI (lint, types, tests, deploy checks, dependency audit)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

## Stack

|                  |                                                                                                                |
| ---------------- | -------------------------------------------------------------------------------------------------------------- |
| **Web** (`web/`) | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Vitest, Playwright                  |
| **API** (`api/`) | Django 5.2 LTS, Django REST Framework, drf-spectacular, Celery, PostgreSQL 17, Redis 8, uv, ruff, mypy, pytest |
| **Services**     | Stripe (payments), Cloudinary (images), Mailjet (email), Google OAuth                                          |
| **Hosting**      | Railway: web, API, Celery worker and beat, Postgres, Redis                                                     |

Read [docs/architecture.md](docs/architecture.md) for how the pieces fit together.

### Images and email

Catalog photos and profile pictures are served from Cloudinary when `CLOUDINARY_URL` is set;
without it, `seed_catalog` points the catalog at static files and the account page hides its
photo controls, so the app still runs.

Google sign-in needs a domain Google will accept as a redirect target, which rules out the free
host's `*.code.run` subdomain. Without the credentials set, the button is simply not rendered.

Mail goes to Mailpit locally even when Mailjet credentials are present, so end-to-end runs can
read verification codes and no real address is written to. Set `USE_MAILJET=true` to check that
the Mailjet account really sends.

## Running locally

Prerequisites: Docker, [uv](https://docs.astral.sh/uv/) and Node.js 22.

```bash
docker compose up -d                      # Postgres (5433), Redis (6379), Mailpit (UI on 8025)

cd api
cp .env.example .env
uv sync
uv run python manage.py migrate
uv run python manage.py seed_catalog    # demo destinations and packages
uv run python manage.py seed_demo_users # traveler@ / admin@trailventure.local, password trailventure-demo
uv run python manage.py runserver         # API docs at http://localhost:8000/api/docs/
# Emails (verification codes) land in Mailpit: http://localhost:8025

cd ../web
cp .env.example .env.local
npm ci
npm run dev                               # http://localhost:3000
```

The web app proxies `/api/*` to Django, so the browser only ever talks to one origin.

### Payments

Checkout needs Stripe test keys in `api/.env` (`STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`). Without
them the booking page says payments are unavailable instead of failing. To confirm bookings locally,
forward the webhook and copy the signing secret it prints into `STRIPE_WEBHOOK_SECRET`:

```bash
stripe listen \
  --events checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.expired,checkout.session.async_payment_failed,charge.refunded \
  --forward-to localhost:8000/api/v1/payments/stripe/webhook/
```

The CLI must be pointed at the same Stripe sandbox the keys came from, or checkout will work
but bookings will never confirm. Run `stripe switch` to pick one; never `--live`.

Pay with card `4242 4242 4242 4242`, any future expiry and any CVC.

## Tests

```bash
cd api && uv run pytest
cd web && npm run test && npm run e2e
# Auth flows run against the real API and Mailpit:
cd web && E2E_FULL_STACK=1 npm run e2e
```

## Contributing and deployment

- [CONTRIBUTING.md](CONTRIBUTING.md): branch flow, commit style, checks.
- [docs/deployment-free.md](docs/deployment-free.md): the live deployment, on Northflank and Upstash free tiers.
- [docs/deployment-railway.md](docs/deployment-railway.md): the paid alternative, all on Railway.
