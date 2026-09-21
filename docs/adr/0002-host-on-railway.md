# ADR 0002: Host on Railway

- **Status:** superseded for the live deployment (2026-09-21) — see the amendment below

## Context
The first version ran Django as a Vercel serverless function (Python 3.9) with Neon Postgres. The rebuild adds long-running pieces that serverless can't host: a Celery worker and beat for emails and payment-hold expiry, Redis for cache, sessions and the queue, and a Stripe webhook that must not hit cold-start timeouts.

## Decision
Run everything as one Railway project, with each service built from its Dockerfile:

| Service | Source | Start |
|---|---|---|
| `web` | `web/Dockerfile` | `node server.js` (Next.js standalone) |
| `api` | `api/Dockerfile` | gunicorn; `migrate` runs as the pre-deploy command |
| `worker` | `api/Dockerfile` | `celery -A config worker` |
| `beat` | `api/Dockerfile` | `celery -A config beat` |
| Postgres, Redis | Railway databases | |

## Consequences
- **Networking:** one dashboard, private networking between services, and only `web` exposed publicly.
- **Cost:** usage-based pricing, roughly US$5–10 a month on the Hobby plan for a portfolio load.
- **Portability:** plain Docker images, so a move to Fly.io or Render stays easy.

## Amendment (2026-09-21)

TrailVenture deploys on free tiers instead: Vercel, Render, Neon and Upstash, documented in
[deployment-free.md](../deployment-free.md). The project is a portfolio piece and the owner
declined a monthly cost for it.

The reasoning above still holds on its own terms — serverless cannot host a Celery worker or
beat. What changed is that those turned out not to be required. Emails run inside the request
(`CELERY_TASK_ALWAYS_EAGER`), and hold expiry runs from a GitHub Actions schedule against a
key-protected endpoint, because `Booking.is_hold_active` is computed from the timestamp and
checkout refuses an expired hold without any background process having run.

The cost is cold starts: a sleeping Render service takes 30–60 seconds to answer. The same
scheduled request that expires holds keeps it warm. The Railway path stays documented and its
service configs stay in the repository, because moving back is a configuration change.
