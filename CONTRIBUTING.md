# Contributing

## Branch flow

```
feat/*  ─┐
fix/*   ─┼─▶ dev ──(release PR)──▶ main
chore/* ─┘
hotfix/* ────────────────────────▶ main (then merge main back into dev)
```

| Branch | Purpose | Merges into | Merge method |
|---|---|---|---|
| `main` | Production. Every merge deploys and is tagged `vX.Y.Z`. | n/a | n/a |
| `dev` | Integration. Always releasable. | `main` via release PR | Merge commit |
| `feat/<short-name>` | New feature | `dev` | Squash |
| `fix/<short-name>` | Bug fix | `dev` | Squash |
| `refactor/`, `perf/`, `chore/`, `docs/`, `test/`, `ci/`, `build/` | Maintenance | `dev` | Squash |
| `hotfix/<short-name>` | Urgent production fix | `main`, then back-merge to `dev` | Squash |

Never push directly to `main` or `dev`. Branch names are lowercase kebab-case, e.g. `feat/booking-quote`.

## Commits and PR titles

Use [Conventional Commits](https://www.conventionalcommits.org/), short and imperative:

```
feat: add departure seat holds
fix: release seats when checkout expires
chore: bump django to 5.2.18
```

Feature PRs are squash-merged, so **the PR title becomes the commit on `dev`**. CI checks the title format.

## Pull requests

1. Branch from the latest `dev`.
2. Open the PR against `dev` and fill in the template.
3. CI must pass: `CI / ci-passed`, `PR policy / title`, and `PR policy / branch-flow`.
4. Squash-merge and delete the branch.

**Release:** open a PR from `dev` to `main` titled `release: vX.Y.Z`, merge it with a merge commit, then tag `main`.

## Local setup

```bash
docker compose up -d        # postgres on 5433, redis, mailpit UI at http://localhost:8025

cd api
cp .env.example .env
uv sync
uv run python manage.py migrate
uv run python manage.py runserver     # http://localhost:8000/api/docs/

cd web
cp .env.example .env.local
npm ci
npm run dev                           # http://localhost:3000
```

Before pushing:

```bash
cd api && uv run ruff format . && uv run ruff check . && uv run pytest
cd web && npm run format && npm run lint && npm run typecheck
```
