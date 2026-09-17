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

# Run Celery tasks (e.g. emails) inline; set CELERY_TASK_ALWAYS_EAGER=false with a worker.
CELERY_TASK_ALWAYS_EAGER = env.bool("CELERY_TASK_ALWAYS_EAGER", default=True)

# Local development and end-to-end runs sign up many accounts from one IP; keep limits loose here.
ACCOUNT_RATE_LIMITS = {
    **ACCOUNT_RATE_LIMITS,
    "signup": "500/h/ip",
    "reset_password": "100/m/ip,20/m/key",
}
