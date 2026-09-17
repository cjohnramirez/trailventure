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

See the [README](README.md#running-locally) for first-time setup.

Before pushing, run the same checks as CI:

```bash
cd api
uv run ruff format . && uv run ruff check . && uv run mypy .
uv run python manage.py makemigrations --check --dry-run --settings=config.settings.test
uv run pytest

cd web
npm run format && npm run lint && npm run typecheck && npm run test
npm run build && npm run e2e
```

## Keeping `web/package-lock.json` installable on Linux

npm on Windows or macOS can write a lockfile that leaves out Linux-only optional packages (for example `@emnapi/*`). CI and the Docker image then fail at `npm ci`. After changing dependencies on Windows or macOS, refresh the lockfile inside a Linux container:

```bash
cd web
docker run --rm -v "$PWD:/app" -w /app node:22-alpine npm install --package-lock-only --ignore-scripts
```

## UI rules

- The rebuild keeps the original TrailVenture design. [docs/design/legacy-ui-reference.md](docs/design/legacy-ui-reference.md) lists the exact values and the deliberate changes: no drop shadows, no Aceternity effects, and better spacing and sizing.
- Every UI element is a shadcn/ui component from `web/src/components/ui`. ESLint blocks importing Radix directly anywhere else.
- Every data view ships loading, empty and error states, and every async button has a pending state.

