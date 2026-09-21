"""Letting an outside scheduler run the jobs a Celery beat process would.

Free hosting has no always-on process, so the periodic work is exposed as an endpoint that a
scheduler (GitHub Actions, an uptime monitor) calls. The shared key is the only thing protecting
it, so it is compared in constant time and the endpoint stays invisible until one is configured.
"""

import secrets

from django.conf import settings
from rest_framework.exceptions import NotFound, PermissionDenied

CRON_HEADER = "X-Cron-Key"


def check_cron_key(request) -> None:
    configured = settings.CRON_SECRET
    if not configured:
        # Nothing configured means the deployment runs a real scheduler; don't advertise the route.
        raise NotFound()
    presented = request.headers.get(CRON_HEADER, "")
    if not secrets.compare_digest(presented, configured):
        raise PermissionDenied("Invalid cron key.")
