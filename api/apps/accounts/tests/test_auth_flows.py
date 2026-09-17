import re

import pytest
from django.contrib.auth import get_user_model
from django.core import mail
from django.urls import reverse
from rest_framework.test import APIClient

from apps.accounts.models import Role

User = get_user_model()

AUTH = "/_allauth/browser/v1/auth"
PASSWORD = "a-strong-trail-password"


def extract_code(message) -> str:
    match = re.search(r"^\s{4}(\S+)\s*$", message.body, re.MULTILINE)
    assert match, message.body
    return match.group(1)


def pending_flow(response) -> str | None:
    flows = response.json().get("data", {}).get("flows", [])
    return next((flow["id"] for flow in flows if flow.get("is_pending")), None)


@pytest.fixture
def client():
    return APIClient()


def signup(client, **overrides):
    payload = {
        "email": "traveler@example.com",
        "password": PASSWORD,
        "first_name": "Juan",
        "last_name": "Dela Cruz",
        **overrides,
    }
    return client.post(f"{AUTH}/signup", payload, format="json")


@pytest.mark.django_db
def test_signup_requires_email_verification_and_sends_a_code(client):
    response = signup(client)

    assert response.status_code == 401
    assert pending_flow(response) == "verify_email"
    assert len(mail.outbox) == 1
    assert mail.outbox[0].subject == "TrailVenture · Confirm your email to finish signing up"
    assert extract_code(mail.outbox[0])
    alternatives = getattr(mail.outbox[0], "alternatives", [])
    assert any(mimetype == "text/html" for _, mimetype in alternatives)


@pytest.mark.django_db
def test_signup_ignores_a_client_supplied_role(client):
    signup(client, role=Role.ADMIN, is_staff=True, is_superuser=True)

    user = User.objects.get(email="traveler@example.com")
    assert user.role == Role.TRAVELER
    assert not user.is_staff
    assert not user.is_superuser
    assert (user.first_name, user.last_name) == ("Juan", "Dela Cruz")


@pytest.mark.django_db
def test_verifying_the_code_signs_the_user_in(client):
    signup(client)
    code = extract_code(mail.outbox[0])

    response = client.post(f"{AUTH}/email/verify", {"key": code}, format="json")

    assert response.status_code == 200
    assert response.json()["meta"]["is_authenticated"] is True
    me = client.get(reverse("me")).json()["user"]
    assert me["email"] == "traveler@example.com"
    assert me["email_verified"] is True
    assert me["role"] == Role.TRAVELER
    assert me["display_name"] == "Juan"


@pytest.mark.django_db
def test_wrong_code_is_rejected(client):
    signup(client)

    response = client.post(f"{AUTH}/email/verify", {"key": "WRONG1"}, format="json")

    assert response.status_code == 400


@pytest.mark.django_db
def test_unverified_login_is_sent_back_to_verification(client):
    signup(client)
    fresh = APIClient()

    response = fresh.post(
        f"{AUTH}/login", {"email": "traveler@example.com", "password": PASSWORD}, format="json"
    )

    assert response.status_code == 401
    assert pending_flow(response) == "verify_email"


@pytest.mark.django_db
def test_login_with_wrong_password_fails(client):
    User.objects.create_user(email="someone@example.com", password=PASSWORD)

    response = client.post(
        f"{AUTH}/login", {"email": "someone@example.com", "password": "not-it"}, format="json"
    )

    assert response.status_code == 400


@pytest.mark.django_db
def test_me_is_null_for_anonymous_visitors_without_a_401(client):
    response = client.get(reverse("me"))

    assert response.status_code == 200
    assert response.json() == {"user": None}


@pytest.mark.django_db
def test_password_reset_by_code(client):
    signup(client)
    client.post(f"{AUTH}/email/verify", {"key": extract_code(mail.outbox[0])}, format="json")
    client.delete(f"{AUTH}/session")
    mail.outbox.clear()

    response = client.post(
        f"{AUTH}/password/request", {"email": "traveler@example.com"}, format="json"
    )
    assert response.status_code == 401
    assert pending_flow(response) == "password_reset_by_code"
    assert mail.outbox[0].subject == "TrailVenture · Your password reset code"
    code = extract_code(mail.outbox[0])

    response = client.post(
        f"{AUTH}/password/reset", {"key": code, "password": "a-brand-new-password"}, format="json"
    )
    assert response.status_code == 200

    user = User.objects.get(email="traveler@example.com")
    assert user.check_password("a-brand-new-password")


@pytest.mark.django_db
def test_superusers_get_the_admin_role():
    admin = User.objects.create_superuser(email="root@example.com", password=PASSWORD)

    assert admin.role == Role.ADMIN
