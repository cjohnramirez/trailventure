import os

os.environ.setdefault("DJANGO_SECRET_KEY", "dev-only-insecure-key")

# DATABASE_URL deliberately has no default. It used to fall back to the local Compose
# database, which meant anything accidentally running these settings in a container failed
# with "connection refused on localhost:5433" instead of saying the variable was missing.
# `cp .env.example .env` supplies it locally.

from .base import *

DEBUG = True
# Overridable so the API can also be reached from a container or a tunnel while developing.
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=["localhost", "127.0.0.1"])
CSRF_TRUSTED_ORIGINS = ["http://localhost:3000"]

WHITENOISE_AUTOREFRESH = True

ACCOUNT_DEFAULT_HTTP_PROTOCOL = "http"

# Mailjet credentials in .env are meant for production. Locally, mail goes to Mailpit so that
# end-to-end runs can read verification codes and no real address is ever written to. Set
# USE_MAILJET=true for a one-off check that the Mailjet account really sends.
if not env.bool("USE_MAILJET", default=False):
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    vars().update(env.email("EMAIL_URL", default="smtp://localhost:1025"))

# Locally there is no worker unless one is started, so tasks run inline by default.
CELERY_TASK_ALWAYS_EAGER = env.bool("CELERY_TASK_ALWAYS_EAGER", default=True)

# Local development and end-to-end runs sign up many accounts from one IP; keep limits loose here.
# `login_failed` matters most: the suite deliberately fails a login in every browser project, and
# production's 5-per-5-minutes would then lock out every later test from the same address.
ACCOUNT_RATE_LIMITS = {
    **ACCOUNT_RATE_LIMITS,
    "login_failed": "100/5m/ip,20/5m/key",
    "signup": "500/h/ip",
    "reset_password": "100/m/ip,20/m/key",
}
