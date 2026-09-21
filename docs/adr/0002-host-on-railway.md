# ADR 0002: Host on Railway

- **Status:** accepted (2026-09-17)

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
