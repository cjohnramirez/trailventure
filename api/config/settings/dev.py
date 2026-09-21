import os

os.environ.setdefault("DJANGO_SECRET_KEY", "dev-only-insecure-key")
os.environ.setdefault(
    "DATABASE_URL", "postgres://trailventure:trailventure@localhost:5433/trailventure"
)

from .base import *

DEBUG = True
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
CSRF_TRUSTED_ORIGINS = ["http://localhost:3000"]

WHITENOISE_AUTOREFRESH = True

ACCOUNT_DEFAULT_HTTP_PROTOCOL = "http"

# Mailjet credentials in .env are meant for production. Locally, mail goes to Mailpit so that
# end-to-end runs can read verification codes and no real address is ever written to. Set
# USE_MAILJET=true for a one-off check that the Mailjet account really sends.
if not env.bool("USE_MAILJET", default=False):
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    vars().update(env.email("EMAIL_URL", default="smtp://localhost:1025"))

# Run Celery tasks (e.g. emails) inline; set CELERY_TASK_ALWAYS_EAGER=false with a worker.
CELERY_TASK_ALWAYS_EAGER = env.bool("CELERY_TASK_ALWAYS_EAGER", default=True)

# Local development and end-to-end runs sign up many accounts from one IP; keep limits loose here.
ACCOUNT_RATE_LIMITS = {
    **ACCOUNT_RATE_LIMITS,
    "signup": "500/h/ip",
    "reset_password": "100/m/ip,20/m/key",
}
