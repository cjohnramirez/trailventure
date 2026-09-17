import pytest
from django.urls import reverse
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_health_reports_ok():
    response = APIClient().get(reverse("health"))

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "ok", "cache": "ok"}


@pytest.mark.django_db
def test_openapi_schema_is_served():
    response = APIClient().get(reverse("schema"))

    assert response.status_code == 200


@pytest.mark.django_db
def test_health_is_degraded_when_cache_fails(monkeypatch):
    from apps.core import views

    monkeypatch.setattr(views, "_cache_ok", lambda: False)
    response = APIClient().get(reverse("health"))

    assert response.status_code == 503
    assert response.json()["cache"] == "unavailable"
