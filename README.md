# TrailVenture

> **Early access.** TrailVenture is a portfolio project that is still being built. Trips, hosts and reviews are demo data, and all payments run in Stripe test mode, so no real money is charged.

TrailVenture is a tour-package booking site for trips across the Philippines and beyond. Travelers search packages by destination, date and budget, compare tiers and itineraries, book, and pay with Stripe.

## Status

The project is being rebuilt from its first version, a Vite SPA and a Django API on Vercel. That version's code is preserved in git history under the `legacy-v1` tag. The rebuild follows [the design spec](docs/specs/2026-09-17-rebuild-design.md) in two phases:

- **Phase A (in progress): parity.** Everything the first version did, rebuilt on a secure stack in the same visual design. That covers search, package pages, booking with Stripe Checkout, reviews, the account page, and sign-in with email verification and Google.
- **Phase B: new features.** Host and admin roles, departures with seat capacity, cancellations and refunds, a security page with 2FA, a wishlist, and itinerary maps.

This README only lists what exists today:

| Area | Implemented |
|---|---|
| API | Django 5.2 project, health check (database + Redis), OpenAPI docs; accounts with email + password, 6-digit email verification and password-reset codes (sent via Mailjet, Celery), Google sign-in, rate limits in Redis, and a server-controlled `role` |
| Web | Original TrailVenture look (theme, logo, header with search pill, footer, early-access notices), home hero, About page; login, register, email verification, forgot/reset password, Google sign-in and a signed-in account page |
| Tooling | Docker images for web and API, Railway service configs, CI (lint, types, tests, deploy checks, dependency audit) |

## Stack

| | |
|---|---|
| **Web** (`web/`) | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Vitest, Playwright |
| **API** (`api/`) | Django 5.2 LTS, Django REST Framework, drf-spectacular, Celery, PostgreSQL 17, Redis 8, uv, ruff, mypy, pytest |
| **Services** | Stripe (payments), Cloudinary (images), Mailjet (email), Google OAuth |
| **Hosting** | Railway: web, API, Celery worker and beat, Postgres, Redis |

Read [docs/architecture.md](docs/architecture.md) for how the pieces fit together.

## Running locally

Prerequisites: Docker, [uv](https://docs.astral.sh/uv/) and Node.js 22.

```bash
docker compose up -d                      # Postgres (5433), Redis (6379), Mailpit (UI on 8025)

cd api
cp .env.example .env
uv sync
uv run python manage.py migrate
uv run python manage.py runserver         # API docs at http://localhost:8000/api/docs/
# Emails (verification codes) land in Mailpit: http://localhost:8025

cd ../web
cp .env.example .env.local
npm ci
npm run dev                               # http://localhost:3000
```

The web app proxies `/api/*` to Django, so the browser only ever talks to one origin.

## Tests

```bash
cd api && uv run pytest
cd web && npm run test && npm run e2e
# Auth flows run against the real API and Mailpit:
cd web && E2E_FULL_STACK=1 npm run e2e
```

## Contributing and deployment

- [CONTRIBUTING.md](CONTRIBUTING.md): branch flow, commit style, checks.
- [docs/deployment-railway.md](docs/deployment-railway.md): production setup on Railway.
