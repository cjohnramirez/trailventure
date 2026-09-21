from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent.parent

env = environ.Env()
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env.str("DJANGO_SECRET_KEY")
DEBUG = env.bool("DJANGO_DEBUG", default=False)
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=[])
CSRF_TRUSTED_ORIGINS = env.list("DJANGO_CSRF_TRUSTED_ORIGINS", default=[])

# Every request arrives through the web app's proxy, which sends its own Host and puts the public
# one in X-Forwarded-Host. Absolute URLs Django builds — above all the OAuth callback — have to use
# the public host, or they point at this service, which isn't reachable from a browser. Trusting the
# header is safe because nothing reaches this service except through that proxy, and ALLOWED_HOSTS
# still validates the result.
USE_X_FORWARDED_HOST = True

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "django_filters",
    "drf_spectacular",
    "anymail",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    "allauth.headless",
    "apps.core",
    "apps.accounts",
    "apps.catalog",
    "apps.bookings",
    "apps.payments",
    "apps.reviews",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

DATABASES = {"default": env.db("DATABASE_URL")}
DATABASES["default"]["CONN_MAX_AGE"] = env.int("DATABASE_CONN_MAX_AGE", default=60)
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "accounts.User"
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {"min_length": 10},
    },
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Manila"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 12,
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

SPECTACULAR_SETTINGS = {
    "TITLE": "TrailVenture API",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
}

# Email: Mailjet (via Anymail) when keys are set, otherwise SMTP (Mailpit locally).
MAILJET_API_KEY = env.str("MAILJET_API_KEY", default="")
MAILJET_SECRET_KEY = env.str("MAILJET_SECRET_KEY", default="")
if MAILJET_API_KEY and MAILJET_SECRET_KEY:
    EMAIL_BACKEND = "anymail.backends.mailjet.EmailBackend"
    ANYMAIL = {"MAILJET_API_KEY": MAILJET_API_KEY, "MAILJET_SECRET_KEY": MAILJET_SECRET_KEY}
else:
    EMAIL_CONFIG = env.email("EMAIL_URL", default="smtp://localhost:1025")
    vars().update(EMAIL_CONFIG)
DEFAULT_FROM_EMAIL = env.str(
    "DEFAULT_FROM_EMAIL", default="TrailVenture <no-reply@trailventure.local>"
)

REDIS_URL = env.str("REDIS_URL", default="redis://localhost:6379/0")

# Redis backs the cache (catalog responses, throttles, auth rate limits) and cached sessions.
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": REDIS_URL,
        "KEY_PREFIX": "tv",
        "TIMEOUT": 300,
    }
}
SESSION_ENGINE = "django.contrib.sessions.backends.cached_db"
SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SAMESITE = "Lax"

ADMIN_URL = env.str("DJANGO_ADMIN_URL", default="django-admin/")

# Payments (Stripe test mode in early access). Empty keys disable checkout with a clear error.
STRIPE_SECRET_KEY = env.str("STRIPE_SECRET_KEY", default="")
STRIPE_PUBLISHABLE_KEY = env.str("STRIPE_PUBLISHABLE_KEY", default="")
STRIPE_WEBHOOK_SECRET = env.str("STRIPE_WEBHOOK_SECRET", default="")

# Images: cloudinary://<api_key>:<api_secret>@<cloud_name>. Empty = seed photos as static files.
CLOUDINARY_URL = env.str("CLOUDINARY_URL", default="")
if CLOUDINARY_URL:
    import cloudinary

    cloudinary.config(cloudinary_url=CLOUDINARY_URL, secure=True)

# --- Authentication (django-allauth, headless) --------------------------------------------------
FRONTEND_URL = env.str("FRONTEND_URL", default="http://localhost:3000").rstrip("/")

AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]

# Six-digit codes for email verification and password reset (fits a one-time-code input).
ALLAUTH_USER_CODE_FORMAT = {"numeric": True, "length": 6, "dashed": False}

ACCOUNT_ADAPTER = "apps.accounts.adapters.AccountAdapter"
SOCIALACCOUNT_ADAPTER = "apps.accounts.adapters.SocialAccountAdapter"
ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_LOGIN_METHODS = {"email"}
ACCOUNT_SIGNUP_FIELDS = ["email*", "password1*", "password2*"]
ACCOUNT_SIGNUP_FORM_CLASS = "apps.accounts.forms.SignupForm"
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_EMAIL_VERIFICATION = "mandatory"
ACCOUNT_EMAIL_VERIFICATION_BY_CODE_ENABLED = True
ACCOUNT_PASSWORD_RESET_BY_CODE_ENABLED = True
ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION = True
ACCOUNT_LOGIN_ON_PASSWORD_RESET = True
ACCOUNT_PREVENT_ENUMERATION = True
ACCOUNT_EMAIL_SUBJECT_PREFIX = "TrailVenture · "
ACCOUNT_DEFAULT_HTTP_PROTOCOL = "https"
# Rate limits are stored in the cache (Redis): e.g. 5 failed logins per 5 minutes per account.
ACCOUNT_RATE_LIMITS = {
    "login_failed": "5/5m/ip,5/5m/key",
    "signup": "20/h/ip",
    # A login with an unverified email re-sends the code, so allow a few sends.
    "confirm_email": "3/5m/key",
    "reset_password": "20/m/ip,5/m/key",
}

HEADLESS_ONLY = True
HEADLESS_CLIENTS = ("browser",)
HEADLESS_FRONTEND_URLS = {
    "account_confirm_email": f"{FRONTEND_URL}/verify-email?key={{key}}",
    "account_reset_password": f"{FRONTEND_URL}/forgot-password",
    "account_reset_password_from_key": f"{FRONTEND_URL}/reset-password?key={{key}}",
    "account_signup": f"{FRONTEND_URL}/register",
    "socialaccount_login_error": f"{FRONTEND_URL}/login?error=social",
}

SOCIALACCOUNT_EMAIL_AUTHENTICATION = True
SOCIALACCOUNT_EMAIL_AUTHENTICATION_AUTO_CONNECT = True
SOCIALACCOUNT_STORE_TOKENS = False
GOOGLE_OAUTH_CLIENT_ID = env.str("GOOGLE_OAUTH_CLIENT_ID", default="")
GOOGLE_OAUTH_CLIENT_SECRET = env.str("GOOGLE_OAUTH_CLIENT_SECRET", default="")
SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "SCOPE": ["profile", "email"],
        "AUTH_PARAMS": {"access_type": "online"},
        "OAUTH_PKCE_ENABLED": True,
        "EMAIL_AUTHENTICATION": True,
        "VERIFIED_EMAIL": True,
        # Without credentials the provider is simply not offered (the web app hides the button).
        "APPS": (
            [
                {
                    "client_id": GOOGLE_OAUTH_CLIENT_ID,
                    "secret": GOOGLE_OAUTH_CLIENT_SECRET,
                    "key": "",
                }
            ]
            if GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET
            else []
        ),
    }
}


def _celery_redis_url(url: str) -> str:
    """Celery rejects a `rediss://` URL that does not say how to verify the certificate.

    Managed Redis (Upstash and others) is TLS-only, so the plain URL they hand out fails at
    import time — and with tasks running eagerly that surfaces as a broken email send rather
    than a broken worker.
    """
    if not url.startswith("rediss://") or "ssl_cert_reqs" in url:
        return url
    separator = "&" if "?" in url else "?"
    return f"{url}{separator}ssl_cert_reqs=CERT_REQUIRED"


CELERY_BROKER_URL = _celery_redis_url(REDIS_URL)
CELERY_RESULT_BACKEND = _celery_redis_url(REDIS_URL)
CELERY_TIMEZONE = TIME_ZONE
CELERY_TASK_ACKS_LATE = True
# Shared key for the scheduled-job endpoint, used where no Celery beat process runs.
CRON_SECRET = env.str("CRON_SECRET", default="")

# Free hosting has no always-on worker, so tasks can be run inside the request instead. Emails
# then add a few hundred milliseconds to a signup; nothing else changes.
CELERY_TASK_ALWAYS_EAGER = env.bool("CELERY_TASK_ALWAYS_EAGER", default=False)
CELERY_TASK_EAGER_PROPAGATES = False

CELERY_BEAT_SCHEDULE = {
    "expire-stale-booking-holds": {
        "task": "apps.bookings.tasks.expire_stale_holds",
        "schedule": 300.0,
    }
}
CELERY_WORKER_PREFETCH_MULTIPLIER = 1

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {"plain": {"format": "%(levelname)s %(name)s %(message)s"}},
    "handlers": {"console": {"class": "logging.StreamHandler", "formatter": "plain"}},
    "root": {"handlers": ["console"], "level": env.str("DJANGO_LOG_LEVEL", default="INFO")},
}
