# TrailVenture Restart Plan: Django API + Next.js, Faithful UI, RBAC

## Context
The first restart attempt (2026-09-15: scaffold, CI, `v0.1.0`) failed, and `main` and `dev` currently point at it. The original app (`trailventure_old`: a Vite/React SPA plus Django 4.2/DRF on Vercel) has a look worth keeping, but underneath it is broken:
- **Privilege escalation:** anyone can register as host or admin.
- **Leaked data:** registration responses return password hashes.
- **Forgeable payments:** any logged-in user can create a "completed" transaction.
- **Price manipulation:** the user picks the checkout currency.
- **Data loss:** a GET request deletes paid bookings.
- **Crashing features:** host create/edit endpoints all crash, and the cancelled page never loads.
- **Silent webhook failures:** the webhook swallows errors and still returns 200.
- **Missing pieces:** no email verification, OAuth, caching, tests, SEO or error states.
- **Secrets in history:** real keys are in git history.

The goal is a portfolio-grade rebuild:
- **Frontend:** reproduces the original UI and flows exactly, minus the Aceternity glow and drop shadows, with the agreed improvements.
- **Backend:** a new, secure Django architecture.
- **Roles:** traveler, host and admin (RBAC), plus Security, wishlist, departures and map features.
- **Early access:** the site states clearly that it's a portfolio project in early access.

Sources of truth for the UI:
- **Old source code:** `C:\Users\JOHN CARL RAMIREZ\Downloads\Coding\trailventure_old\frontend`
- **Baseline screenshots:** captured in M0 from the old app running locally.

## Decisions (agreed with you)
| Topic | Decision |
|---|---|
| Build order | **Phase A:** reach parity with the current site on the new stack and ship `v1.0.0`. **Phase B:** new features (RBAC host/admin, departures, refunds, security page, wishlist, map, demo) added and optimized afterwards |
| Git | Reset `main` and `dev` to legacy tip `dc5bc37c` (tag `legacy-v1`). All work goes on one long branch, `feat/rebuild`, cut from `dev` |
| Deploy | Everything on Railway: web, api, worker, beat, Postgres, Redis |
| Auth | Email + password with Mailjet verification codes, Google OAuth, sessions, TOTP 2FA, Security page |
| Host onboarding | User applies, admin approves (email sent both ways) |
| Admin | In-app `/admin` dashboard. Django admin stays at `/django-admin/` for superusers only |
| v1 extras | Departures with seat capacity, wishlist, Security page (sessions + 2FA), itinerary map |
| Host scope | Package editor, submit for review, bookings and guest lists, earnings dashboard (payouts simulated) |
| Refunds | Free cancellation up to 7 days before departure (full Stripe refund); no refund after that |
| Admin scope | Users and roles, host applications, package moderation plus destinations and fees, bookings/payments/refunds/webhook log, review moderation, overview metrics |
| Demo | Import the legacy catalog. "Try as Host" and "Try as Admin" demo logins, with destructive actions blocked. Nightly reset |
| Fonts | Alumni Sans (wordmark, EXPLORE, section titles) + Geist for body and UI, via `next/font`. Section headings shrink from 70px to 56px semibold |
| Logo | "Peak + path" TV monogram: the V is a valley with a dotted trail. Three variants to pick from on a design canvas |
| UI improvements | Skeletons instead of the full-screen loader, the same header and footer on every page, Airbnb-style booking card (sticky, plus a mobile bottom bar opening a Drawer), toasts, inline form errors, pending states on buttons, ₱12,000 formatting |
| Disclaimer | Dismissible top banner, "Early access" badge next to the logo, test-mode notice at checkout, footer note, `/about` page |

Decided by me:
- **Stack:** Django 5.2 LTS + DRF + django-allauth (headless).
- **Session model:** httpOnly session cookies behind a same-origin Next.js proxy, with no JWTs in localStorage.
- **Currency:** PHP only, with amounts stored as integer centavos.

---

## M0: Reset, hygiene, baseline (first)
1. **Reset the branches** (you run the pushes; I prepare the commands):
   - `git fetch`, then on `main` run `git reset --hard dc5bc37c`.
   - Run `git push --force-with-lease origin main` and `git push --force-with-lease origin dc5bc37c:dev`.
   - If GitHub branch protection blocks the force-push, turn it off temporarily.
   - Delete the `v0.1.0` tag and release (`git push origin :refs/tags/v0.1.0`, `git tag -d v0.1.0`), and keep `legacy-v1`.
   - This throws away the current unstaged deletions on `main`, which is intended.
2. **Secret rotation: deferred** (your call). The legacy keys in git history are handled when legacy code is fully deleted at the end of the plan.
3. **Run the old app locally** from `trailventure_old`, a throwaway clone that is never committed:
   - Backend: `uv venv -p 3.12`, then `pip install -r requirements.txt`.
   - Add a local settings override that uses SQLite, DEBUG on and CORS for localhost.
   - Run `migrate`, then `loaddata` on `data.json` excluding contenttypes and auth.permission.
   - Make sure the `AdditionalFees` row with pk=2 exists.
   - Frontend: set `VITE_VERCEL_URL=http://localhost:8000/` and run `npx vite`.
   - Click through every flow: search, package, book, Stripe test checkout via `stripe listen`, success and cancel pages, reviews, user page, login and register.
   - The known broken flows (register URL, cancelled page) get patched locally only, so they can be seen.
4. **Baseline capture:** a Playwright script screenshots every page and state:
   - Viewports 1440 and 390px, light and dark.
   - Covers the popovers (search segments, menu) and dialogs.
   - Output goes to `docs/design/baseline/`, along with a token sheet (exact classes, colors, sizes) taken from the source.
5. **Initial commits on `feat/rebuild`:**
   - **Legacy code stays** in `backend/` and `frontend/` for the whole plan, as a reference next to the new `api/` and `web/`. It is fully deleted in one step once the entire plan (Phase A and Phase B) is complete.
   - Commit this plan as `docs/specs/2026-09-17-rebuild-design.md`.

## Architecture
```
trailventure/
  api/   Django 5.2 LTS · Python 3.13 · uv · DRF · drf-spectacular · django-filter
         allauth[headless,socialaccount,mfa,usersessions] · django-anymail[mailjet]
         cloudinary · stripe · celery+redis · django-redis cache · psycopg3 · gunicorn
         ruff · mypy(django-stubs) · pytest-django · factory-boy
  web/   Next.js 16 App Router · React 19 · TS strict · Tailwind v4 · shadcn/ui (Radix)
         TanStack Query (client mutations) · openapi-typescript + openapi-fetch
         react-hook-form + zod · nuqs · next-themes · sonner · maplibre-gl · Vitest · Playwright
  docker-compose.yml   postgres · redis · mailpit · stripe-cli (profile)
  .github/             ci.yml · pr-policy.yml · dependabot.yml · pull_request_template.md
  docs/                architecture.md · deployment-railway.md · design-system.md · adr/ · specs/
```
- **Same-origin setup:** Next `rewrites` proxy `/api/*`, `/_allauth/*` and `/django-admin/*` to the api service over Railway private networking.
  - Cookies stay first-party.
  - CSRF uses the `csrftoken` cookie and an `X-CSRFToken` header.
  - Server Components forward the request cookies.

## Backend design (`api/`)
**Layering**
- Thin views, `services.py` for writes and business rules, `selectors.py` for optimized reads.
- Tests focus on services and permissions.
- URL prefix `/api/v1/`, OpenAPI at `/api/docs/`.
- CI fails on drift between the schema and the generated TypeScript client.

**Apps and models**
- **`accounts`**
  - `User`: email login, unique email, and `role` (traveler, host, admin; default traveler, never writable by the client).
  - `Profile`: OneToOne. Names, phone, date of birth, avatar/banner Cloudinary public_ids, social links (keeps the old UserPage fields).
  - `HostApplication`: status (pending, approved, rejected), reason, reviewer.
  - `AuditLog`: actor, action, target, metadata.
- **`catalog`**
  - `Destination`: slug, name, region, country, description, image, `featured_order` (drives the home bento).
  - `Package`:
    - Ownership and content: host, destination, slug, name, description, address.
    - `status`: draft, in review, changes requested, published, archived.
    - Denormalized: `min_price` and `rating_avg`/`rating_count`.
  - `PackageImage`: order, alt text.
  - `Amenity`: global, unique name. Linked M2M to packages and to tiers.
  - `Tier` (formerly PackageType): price in centavos, description.
  - `ItineraryStop` (formerly PackageRoutePoint): tier, day, order, title, location, lat/lng, start/end time, description.
- **`bookings`**
  - `Departure`: package, start date, capacity, seats held, seats booked, status.
  - `Booking`:
    - Identity: UUID, user, departure, tier, guests.
    - Price snapshot: unit price, site fee, tax, total.
    - status: pending_payment, confirmed, cancelled, expired, refunded.
    - `hold_expires_at`.
  - `FeeSchedule`: active tax % and site fee %, replacing the hardcoded pk=2.
- **`payments`**
  - `Payment`: booking, checkout session id (unique), payment intent, amount, status, refund id.
  - `StripeEvent`: unique `event_id`, payload, processed timestamp.
- **`reviews`**
  - `Review`: OneToOne to a confirmed booking whose departure is past; rating 1–5; `is_hidden` for moderation.
  - `WishlistItem`: user + package, unique together.
- **`core`**: health check, demo mode, the cache helper, Mailjet email templates.

**RBAC**
- **Permissions** (DRF classes): `IsTraveler`, `IsApprovedHost`, `IsAdminRole`, `IsPackageOwner` (object-level), and `NotDemoAccount` for destructive endpoints.
- **Role changes:**
  - Only through `accounts.services` (`approve_host_application`, `set_role`), always writing an `AuditLog` entry.
  - Admins can't demote themselves or the last admin.
- **Admin 2FA:** admin endpoints and `/django-admin/` require a session that completed TOTP (middleware).
- **Frontend gating:** Next `proxy.ts` gates `/account`, `/host` and `/admin` for UX only. Django enforces the real rules.

**Auth (allauth headless)**
- **Login and signup:** email login, with mandatory verification by 6-digit code sent via Mailjet (anymail; Mailpit locally).
- **Recovery and OAuth:** password reset by code, Google OAuth.
- **Security features:**
  - Rate limits on auth endpoints, stored in Redis.
  - TOTP and recovery codes.
  - Session list with revoke.
  - Reauthentication before changing email or password, applying as host, or deleting the account.
- **Verified email gate:** an unverified user can browse but can't book, review or apply.

**Booking and payment flow** (keeps the old sequence: package → booking page → Stripe → success/cancelled)
1. `POST /bookings/quote` returns the price breakdown. The server is the only source of prices.
2. `POST /bookings` holds the seats:
   - Inside `transaction.atomic` with `select_for_update` on the Departure.
   - Creates a `pending_payment` booking with a 30-minute hold.
   - Creates a Stripe Checkout Session in PHP centavos, with `expires_at`, `metadata.booking_id` and an idempotency key.
   - Returns the checkout URL.
3. **Webhook** (`/api/v1/payments/stripe/webhook`):
   - Verifies the signature, then inserts a `StripeEvent`; a duplicate event does nothing.
   - `checkout.session.completed` (paid) or `async_payment_succeeded`: confirm the booking and move seats from held to booked.
   - `expired` or `async_payment_failed`: release the seats and mark the booking expired.
   - `charge.refunded`: mark the booking refunded.
   - Unexpected errors return a 5xx so Stripe retries.
4. **Success page** polls `GET /bookings/{id}` until the booking is confirmed, and shows a "confirmation delayed" message after 60s.
   - The cancelled page is read-only: it shows the booking and a "Try again" button while the hold is still active.
5. **Traveler cancellation:** `POST /bookings/{id}/cancel` refunds in full if departure is at least 7 days away; otherwise it cancels without a refund, after a warning dialog.
   - When a host cancels a departure, every booking on it is refunded.
6. **Celery:** `expire_stale_holds` every 5 min, confirmation/cancellation/review-request emails, `reset_demo_data` nightly.

**Caching and performance (Redis)**
- **Django cache backend:** Redis.
  - Cached: home destinations, package detail, search pages and the active fee schedule.
  - Keys carry a version bumped by `post_save`/`post_delete` signals, so a write invalidates them.
  - Sessions use `cached_db`.
  - Throttles and allauth rate limits use Redis.
- **Next.js caching:**
  - Public pages use `fetch` with `next: { tags, revalidate: 300 }`.
  - Django calls a signed Next `/api/revalidate` route (from a Celery task) when a package, destination or review changes.
- **Queries:**
  - `select_related`/`prefetch_related` in every selector.
  - Price and rating are denormalized, with DB indexes on the search filters.
  - Every list is paginated; a query-count assertion test guards against N+1s.
- **Images:** direct signed browser uploads to Cloudinary. `next/image` uses a Cloudinary loader (`f_auto,q_auto,w_*`).

**Security**
- **Deploy settings:**
  - `check --deploy` must pass.
  - `DEBUG` and `ALLOWED_HOSTS` come from env.
  - `CSRF_TRUSTED_ORIGINS`, HSTS, secure/httpOnly/SameSite=Lax cookies.
- **Headers:** CSP set by Next (`proxy.ts`) and `X-Frame-Options`.
- **Request handling:** serializers use explicit fields (no `__all__`) with `validate_password`, and no client-supplied user, role, price or currency is ever trusted.
- **Error handling:** errors use the RFC 7807-style problem format, and internal exceptions are never shown to users.
- **Ops:** Sentry is optional (behind an env var), `ruff` S rules on, and `pip-audit` / `npm audit` run in CI.

**Search API**
- `GET /api/v1/packages?destination=&start=&end=&min_price=&max_price=&rating=&page=`
- Implements the old UI's review-score filter, which the old backend never supported.

## Frontend design (`web/`)
**Visual fidelity rules** (from the source audit)
- **Tokens:**
  - Copy the zinc shadcn colors exactly into Tailwind v4 `@theme` / CSS variables, light and dark.
  - Brand teal is `teal-500` (#14b8a6). Old hover colors (`teal-300`, `teal-400`) and rating teal `#16baa8` become named tokens (`--brand`, `--brand-hover`, `--rating`).
  - Text on teal is `zinc-950` everywhere, which passes AA; this replaces the failing white-on-teal.
  - Surface colors `#f4f4f5` / `#0e0e11` become `--muted-surface` tokens.
  - Radius: `rounded-2xl` section cards, `rounded-xl` inner cards, `rounded-full` buttons and pills, `border-[1px]` outlines kept.
- **No shadows:** every `shadow-*` goes, replaced by the existing borders. The header gets `border-b` when scrolled instead of `shadow-lg`.
- **No glow:** no Aceternity or GlowingEffect, and no `motion` animation except Drawer/Dialog transitions. `prefers-reduced-motion` is respected.
- **Buttons** keep the old variants (outline with `hover:bg-teal-300`, and so on), implemented as shadcn `Button` cva variants.
  - Added: a `brand` variant (teal) and a `pending` prop (Spinner + disabled + `aria-busy`).
  - No wrapper div, so width classes work.
- **Fonts:** Alumni Sans on `.title` (wordmark `text-4xl`, EXPLORE `100/150px`, section titles 40→56px semibold uppercase). Geist for everything else; prices use `tabular-nums`.
- **Components:** all from shadcn (per the pinned rule), with the `shadcn` skill loaded for UI work.
  - Tables use `DataTable` (TanStack Table), side panels use `Sheet`, mobile bottom sheets use `Drawer`, feedback uses `Sonner` toasts.

**Routes** (old flows preserved; old URLs redirect)
| Old | New |
|---|---|
| `/` | `/` (sections in the same order): sticky header → rounded hero, EXPLORE, search pill docking into header via IntersectionObserver → FEATURED DESTINATIONS bento with floating labels → CHOOSE US 4 cards + hiking image → footer |
| `/search/:loc/:start/:end/:min/:max/:page` | `/search?destination=&start=&end=&min=&max=&rating=&page=` (nuqs), same filter aside and 2-column card grid, cards say "from ₱X / person". Old URLs get a 308 redirect |
| `/package/:id` | `/package/[slug]`: carousel, description, tier buttons, amenity pills, reviews, itinerary column, bottom section-nav pill. The booking card (tier, departure, guests, breakdown, Book) is sticky in the right column above the itinerary; mobile gets a bottom bar and Drawer. Adds the map and wishlist heart |
| `/booking/:id/:type/:qty/:date` | `/booking/[slug]?tier=&departure=&guests=`: same summary / configuration / rules / Invoice layout, "Proceed to Checkout" plus the test-mode Alert |
| `/booking/success/:id`, `/booking/cancelled/:id` | Same pages (confetti kept, respects reduced motion) backed by the real booking status |
| `/user-page` | `/account` (same banner, avatar, profile card, details, bookings, reviews layout) plus `/account/bookings`, `/account/wishlist`, `/account/settings` (edit profile), `/account/security` |
| `/login`, `/register` | Same split card (FormPage image + form), plus Google button, "Try as Host / Admin", `/verify-email` (InputOTP), `/forgot-password`, `/reset-password`, `/2fa` |
| n/a | `/become-a-host`, `/host` (overview/earnings, packages, package editor steps, departures, bookings), `/admin` (overview, users, host applications, moderation queue, destinations, fees, bookings & payments, webhook events, reviews, audit log), `/about` |

- **Header:** wordmark + "Early access" Badge, search pill, Login/avatar button, and the Menu dropdown (theme, account, host and admin links by role, logout).
  - Mobile: Menu opens a `Sheet`.
  - Host and admin areas use the shadcn `Sidebar` shell with the same header.
  - The profile is fetched only when a session exists, so logged-out pages make zero 401 requests.
- **Disclaimer:**
  - Dismissible banner above the header, remembered in localStorage, safe when storage fails.
  - Footer note: "Portfolio project in early access. Payments are Stripe test mode."
  - `/about` page.
  - Checkout Alert with test card 4242 4242 4242 4242.
- **Logo:**
  - Draft three "Peak + path" TV monogram variants on a design canvas (16px, 32px, header lockup, OG size; light and dark), and you pick one.
  - Output: SVGs (mark, lockup, mono), `app/icon.svg`, `apple-icon.png`, `opengraph-image.tsx`, and an email header.

**States matrix** (each is implemented and tested)
| View | Loading | Empty | Error |
|---|---|---|---|
| Home bento | Skeleton bento in the grid shape | Section hidden | Inline Alert + Retry |
| Search | 6 skeleton cards, "Searching…" count | "No packages found matching your filters" + Clear filters | Alert + Try again |
| Package | `loading.tsx` skeleton | Gallery adapts to the number of images; "No reviews yet"; "No upcoming departures" + Save to wishlist | `error.tsx`, `not-found.tsx` |
| Booking / checkout | Button pending (disabled + spinner) | n/a | Inline error; "hold expired", "sold out", "email not verified" warnings |
| Account, host and admin tables | Skeleton rows | Empty with a call to action | Error row + Retry |
| Forms | Pending submit | n/a | Field errors mapped from the API + form Alert |

Warning states cover: few seats left, hold expiring, unverified email, demo-mode blocked action, changes requested on a package.

**SEO and accessibility**
- **SEO:** `generateMetadata` per page, OG images, `sitemap.ts`, `robots.ts`, canonical URLs, and JSON-LD (`TouristTrip`, `AggregateRating`, `BreadcrumbList`). Public catalog pages are server-rendered.
- **Accessibility:**
  - Semantic headings and alt text from the model, instead of Cloudinary ids.
  - Labelled icon buttons, a keyboard-accessible destination combobox (`Command`), and a visible focus ring.
  - No `<Link>` inside `<button>` (use `Button asChild`).
  - `next-themes` avoids the dark-mode flash.
- **Target:** axe finds no serious violations, and Lighthouse scores ≥ 90 for a11y and SEO.

## RBAC user flows
- **Traveler:** sign up → verify code → search → package → pick departure, tier and guests → booking page → Stripe → success (polled) → account bookings → cancel (refund rule) → review after the trip → wishlist.
- **Become a host:**
  - Verified traveler → `/become-a-host` (reauthenticate, form) → application pending (banner in account).
  - Admin approves or rejects with a reason → Mailjet email → role becomes host → `/host` unlocked.
- **Host packages:**
  1. Create a draft through Details → Tiers & amenities → Itinerary (map pins) → Photos → Departures.
  2. A checklist must pass before submitting for review.
  3. The admin approves (published, cache revalidated) or requests changes (host sees the notes).
  4. Editing a published package keeps it live; price changes don't affect existing bookings.
- **Host operations:** departures calendar, manifest per departure, cancel a departure (refunds everyone), earnings charts.
- **Admin:**
  - Overview metrics, users (suspend, change role, audit-logged), host applications, moderation queue, destinations (bento order), fee schedule.
  - Bookings & payments (refund), Stripe webhook events, hide reviews, audit log.
  - 2FA is required.
- **Demo:**
  - "Try as Host / Admin" signs into seeded demo accounts; the admin demo skips 2FA and is read-mostly.
  - `NotDemoAccount` blocks refunds, role changes and deletions with a friendly warning toast.
  - Nightly reset.

## Testing
- **api (pytest):**
  - Signup can't set a role.
  - A host can't edit another host's package.
  - Only admins approve applications.
  - Two concurrent bookings for the last seat: exactly one succeeds.
  - Replaying the same webhook event is idempotent, and signatures are checked.
  - An expired hold releases its seats.
  - Refund window at 7 days (±1 day boundaries).
  - Quote total equals the Stripe amount.
  - A review requires a completed booking.
  - Cache invalidation on save.
  - Query-count limits on list endpoints.
  - An unverified user can't book; admin endpoints without 2FA return 403; demo guard.
  - Coverage ≥ 85% on services.
- **web (Vitest + Testing Library):** Price formatting, the booking card's state logic, form schemas, and the button pending prop.
- **Playwright** (projects: desktop Chromium, mobile Pixel 7, dark scheme):
  - **E2E:**
    - Signup and read the code from the Mailpit API.
    - Search → book → Stripe test checkout (a signed webhook fixture in CI; the real `stripe listen` locally).
    - Cancel and refund.
    - Host application → admin approval → create package → review → published → appears in search.
    - Demo logins.
    - TOTP enrollment with `otplib`.
  - **States:** `page.route` mocks delayed, empty and 500 responses for every data view, checking the skeleton, empty and error UI, with zero 401s logged out.
  - **Accessibility:** `@axe-core/playwright` on every public page.
  - **Visual:** `toHaveScreenshot` at 1440 and 390px, light and dark, compared by eye in PR review against `docs/design/baseline/` (differences only where agreed).

## CI, PR template, docs
- **`ci.yml`:**
  - Path filters.
  - **api job:** uv sync --locked, ruff format/check, mypy, `makemigrations --check`, `check --deploy` (prod settings with dummy env), pytest with Postgres + Redis services, schema drift check.
  - **web job:** npm ci, prettier, eslint (including the `no-restricted-imports` guard allowing Radix only inside `components/ui`), typecheck, vitest, build.
  - **e2e job:** docker compose (api + worker + postgres + redis + mailpit), Playwright with an uploaded HTML report.
  - **audit job:** `pip-audit`, `npm audit --omit=dev`.
  - A single required `ci-passed` check.
- **Other GitHub files:**
  - `pr-policy.yml`: Conventional Commit PR titles, and branch flow (feature → dev; dev or hotfix → main).
  - `dependabot.yml` targets `dev`.
  - `pull_request_template.md`: summary, type, changes, screenshots at 1440/390 light and dark, how to test, and a checklist (tests, migrations, schema/client regenerated, loading/empty/error states, a11y, no secrets).
- **Docs:**
  - A README that only claims features that exist, with an early-access note, architecture diagram, demo logins and screenshots.
  - `CONTRIBUTING.md`, `docs/architecture.md`, `docs/design-system.md` (tokens, fidelity rules, states), `docs/deployment-railway.md`, `docs/adr/` (auth choice, Railway, fidelity policy), `api/.env.example`, `web/.env.example`.

## Deployment (Railway)
- **Services in one project:**
  - `web`: Next standalone Dockerfile, the only public domain.
  - `api`: gunicorn Dockerfile, `preDeployCommand: migrate`, private networking.
  - `worker`: celery worker.
  - `beat`: celery beat.
  - Postgres and Redis plugins.
- **Routing:** the Stripe webhook and `/django-admin` reach Django through the web proxy.
- **Config:** per-service `railway.json`, and env var reference variables (`${{Postgres.DATABASE_URL}}`).
- **Deploy triggers:** `main` deploys production. `dev` can deploy to an optional staging environment.
- **Cost:** about $5–10/month on the Hobby plan.

## Milestones (all on `feat/rebuild`, commit per task; you push)
**Build order (your call):** first rebuild what the old site already does, on the new secure stack, and ship it. After that, add and optimize the new feature sets one at a time.

### Phase A: parity with the current implementation (release `v1.0.0`)
- **M0:** Reset, secret rotation, run the old app, baseline screenshots, spec committed.
- **M1:** Foundations: api and web scaffolds, compose, CI, PR template, docs skeleton, env examples, Railway services.
- **M2:** Design system and shell:
  - Tokens, fonts, restyled shadcn primitives.
  - Header with docking search pill, Menu, footer, early-access banner, badge, `/about`.
  - Logo pick and assets.
- **M3:** Auth, covering what the old site had plus what you required:
  - Sign up, sign in, logout, with Mailjet email verification, password reset and Google OAuth.
  - Login/register pages in the old split-card design.
  - The `role` field exists and is server-controlled (fixes the escalation hole). Everyone is a traveler at this stage.
- **M4:** Catalog:
  - Models and legacy importer.
  - Home (bento, CHOOSE US), Search (filters including rating), Package page (carousel, tiers, amenities, itinerary, reviews list).
  - Redis cache, SEO, all states.
- **M5:** Booking and Stripe, same flow as the old site:
  - Pick tier, date and quantity on the package page, then the booking page and invoice, then Checkout, then the success/cancelled pages.
  - Server-side quote, PHP centavos, idempotent webhook, unpaid bookings expire (never deleted by GET).
  - Checkout test-mode notice.
- **M6:** User page and reviews: `/account` (profile, bookings with details dialog, reviews), profile editing (the old modify endpoint was never wired), and review create restricted to completed paid bookings.
- **M7:** Parity hardening and release:
  - axe and Lighthouse passes, visual comparison against the baseline, E2E of all parity flows in CI.
  - Railway production deploy and honest README.
  - PR `feat/rebuild → dev`, then `release: v1.0.0` (dev → main), with ready-to-paste PR text.

### Phase B: new feature sets, added and optimized afterwards
Order is a proposal we can revisit after v1.0.0. Per your branching rule, once the rebuild plan is done, each of these gets its own feature branch.
- **B1:** Departures and seat capacity: seat holds under `select_for_update`, the booking card changes from free date pick to departure pick, migration from the dates on existing bookings.
- **B2:** Cancellations and refunds: 7-day rule, `charge.refunded`, account cancel flow.
- **B3:** RBAC host side: become-a-host application, `/host` package editor, submit for review, departures, manifests, earnings.
- **B4:** Admin dashboard: users/roles, applications, moderation, destinations/fees, payments/refunds/webhook log, reviews, AuditLog, metrics, admin 2FA requirement.
- **B5:** Security page: sessions and revoke, TOTP, reauthentication rules.
- **B6:** Wishlist and itinerary map.
- **B7:** Demo mode: "Try as Host / Admin", `NotDemoAccount` guard, nightly reset.
- **Release cadence:** each B-milestone ends with tests, docs and a `release: v1.x.0`.

The Backend, RBAC, States and Testing sections above describe the **end state**. During Phase A, implement only the parts the parity flows need:
- **Build now:** Booking uses a start date and has no departure. There are no host, admin or demo endpoints. The Security page, wishlist and map are left out.
- **Design now, build later:** Keep models and permission classes shaped so Phase B only adds to them, with no rewrites (for example the `role` field, a `status` on Booking and Package, and a service layer).

## Verification
- **Local stack:** `docker compose up -d`, then `uv run manage.py migrate && import_legacy && runserver`, `celery worker/beat`, `npm run dev`, and `stripe listen --forward-to localhost:8000/api/v1/payments/stripe/webhook`.
- **Manual walkthrough:**
  - Every old flow side by side with the old app at `localhost:5173`, at 1440/390px in light and dark.
  - The traveler, host and admin flows above, including pay with 4242 and let a hold expire.
- **Automated checks:** `uv run pytest`, `npm run test`, `npx playwright test`, and the CI checks green on the pushed branch before any PR.
- **After deploy:**
  - `manage.py check --deploy`.
  - A Stripe dashboard test event gets a 200 response and is deduped.
  - Lighthouse on `/` and `/package/[slug]`.
  - Mailjet verification email arrives.
  - Google OAuth callback works on the Railway domain.
