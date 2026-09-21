import logging

from django.core.cache import cache
from django.db import connection
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

logger = logging.getLogger(__name__)


def _database_ok() -> bool:
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
    except Exception:
        logger.exception("Health check: database unavailable")
        return False
    return True


def _cache_ok() -> bool:
    try:
        cache.set("health:ping", "pong", timeout=5)
        return cache.get("health:ping") == "pong"
    except Exception:
        logger.exception("Health check: cache unavailable")
        return False


@extend_schema(
    responses=inline_serializer(
        "Health",
        fields={
            "status": serializers.CharField(),
            "database": serializers.CharField(),
            "cache": serializers.CharField(),
        },
    )
)
@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    database = _database_ok()
    cache_ready = _cache_ok()
    healthy = database and cache_ready
    return Response(
        {
            "status": "ok" if healthy else "degraded",
            "database": "ok" if database else "unavailable",
            "cache": "ok" if cache_ready else "unavailable",
        },
        status=status.HTTP_200_OK if healthy else status.HTTP_503_SERVICE_UNAVAILABLE,
    )
