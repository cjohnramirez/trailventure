import os

os.environ.setdefault("DJANGO_SECRET_KEY", "test-only-insecure-key")
os.environ.setdefault(
    "DATABASE_URL", "postgres://trailventure:trailventure@localhost:5433/trailventure"
)

from .base import *

PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]

# Never touch real accounts from a test run, whatever the developer has in .env. The tests that
# cover Cloudinary set this themselves and patch the upload.
CLOUDINARY_URL = ""
STRIPE_SECRET_KEY = "sk_test_unit"  # noqa: S105  (placeholder; no request ever leaves the suite)
STRIPE_PUBLISHABLE_KEY = "pk_test_unit"
STRIPE_WEBHOOK_SECRET = "whsec_unit"  # noqa: S105
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
CELERY_TASK_ALWAYS_EAGER = True
CACHES = {"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}}
SESSION_ENGINE = "django.contrib.sessions.backends.db"
STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.InMemoryStorage"},
    "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
}

WHITENOISE_AUTOREFRESH = True
