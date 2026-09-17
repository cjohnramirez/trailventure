# ADR 0001: Same-origin session auth

- **Status:** accepted (2026-09-17)

## Context
The first version kept JWT access and refresh tokens in `localStorage`. Any XSS could read them, refresh only ran on page load, and there was no logout, email verification or OAuth. The rebuild needs email verification (Mailjet), Google sign-in and, later, 2FA and session management.

## Decision
- **Auth library:** django-allauth in headless mode with Django's session cookies. Allauth covers email verification, password reset, Google OAuth, rate limits, TOTP and session tracking.
- **Same-origin proxy:** the browser reaches Django only through Next.js rewrites. That keeps the cookies first-party and needs no CORS.
- **Cookie flags:** the session cookie is `httpOnly`, `Secure` and `SameSite=Lax`. CSRF protection uses the `csrftoken` cookie and an `X-CSRFToken` header.

## Consequences
- **Upside:** no tokens are readable by JavaScript, and logout and session revocation work immediately.
- **Constraint:** Django and Next.js must share an origin in every environment. Locally that's `localhost:3000`, which rewrites to `:8000`.
- **Server Components:** they must forward the incoming `cookie` header when calling the API.
