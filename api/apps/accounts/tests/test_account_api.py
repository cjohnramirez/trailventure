from datetime import date

import pytest
from django.urls import reverse

from apps.accounts.models import Profile


def test_every_new_user_gets_a_profile(traveler):
    assert Profile.objects.filter(user=traveler).exists()


def test_account_requires_a_session(client):
    assert client.get(reverse("account")).status_code == 403


def test_account_returns_the_traveler_and_their_profile(client, traveler):
    client.force_login(traveler)

    body = client.get(reverse("account")).json()

    assert body["email"] == traveler.email
    assert body["role"] == "traveler"
    assert body["profile"]["phone"] == ""
    assert body["profile"]["avatar_url"] == ""


def test_account_edits_names_and_profile_fields(client, traveler):
    client.force_login(traveler)

    response = client.patch(
        reverse("account"),
        {
            "first_name": "Tala",
            "last_name": "Reyes",
            "profile": {
                "phone": "+63 917 000 0000",
                "date_of_birth": "1998-04-02",
                "instagram_url": "https://instagram.com/tala",
            },
        },
        content_type="application/json",
    )

    assert response.status_code == 200
    traveler.refresh_from_db()
    assert traveler.first_name == "Tala"
    assert traveler.profile.phone == "+63 917 000 0000"
    assert traveler.profile.date_of_birth == date(1998, 4, 2)
    assert traveler.profile.instagram_url == "https://instagram.com/tala"


@pytest.mark.parametrize("field,value", [("role", "admin"), ("email", "hacker@example.com")])
def test_account_never_accepts_privileged_fields(client, traveler, field, value):
    client.force_login(traveler)
    before = getattr(traveler, field)

    response = client.patch(reverse("account"), {field: value}, content_type="application/json")

    assert response.status_code == 200
    traveler.refresh_from_db()
    assert getattr(traveler, field) == before


def test_photo_keys_cannot_be_set_directly(client, traveler):
    client.force_login(traveler)

    client.patch(
        reverse("account"),
        {"profile": {"avatar": "someone/elses/photo"}},
        content_type="application/json",
    )

    traveler.refresh_from_db()
    assert traveler.profile.avatar == ""


def test_upload_signature_needs_cloudinary(client, traveler, settings):
    settings.CLOUDINARY_URL = ""
    client.force_login(traveler)

    response = client.post(
        reverse("account-photo-signature"), {"kind": "avatar"}, content_type="application/json"
    )

    assert response.status_code == 400


def test_setting_a_photo_stores_a_versioned_key(client, traveler):
    client.force_login(traveler)

    response = client.post(
        reverse("account-photo"),
        {"kind": "avatar", "version": 1738000000},
        content_type="application/json",
    )

    assert response.status_code == 200
    traveler.refresh_from_db()
    assert traveler.profile.avatar == f"v1738000000/trailventure/accounts/avatars/{traveler.pk}"
    assert response.json()["profile"]["avatar_url"].endswith(traveler.profile.avatar)


def test_a_photo_can_be_removed(client, traveler):
    traveler.profile.avatar = "v1/trailventure/accounts/avatars/1"
    traveler.profile.save()
    client.force_login(traveler)

    response = client.delete(
        reverse("account-photo"), {"kind": "avatar"}, content_type="application/json"
    )

    assert response.status_code == 200
    traveler.refresh_from_db()
    assert traveler.profile.avatar == ""


def test_capabilities_reports_whether_uploads_work(client, settings):
    settings.CLOUDINARY_URL = ""
    assert client.get(reverse("capabilities")).json() == {"photo_uploads": False}
