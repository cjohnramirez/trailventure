from datetime import date, timedelta

import pytest
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient

from apps.bookings.models import Booking
from apps.bookings.services import HOLD_DURATION, expire_stale_holds
from apps.catalog.models import Package


@pytest.fixture
def client(traveler):
    api = APIClient()
    api.force_authenticate(traveler)
    return api


def book(client, tier, start_date, guests=2):
    return client.post(
        reverse("booking-create"),
        {"tier": tier.id, "start_date": start_date.isoformat(), "guests": guests},
        format="json",
    )


def test_quote_adds_site_fee_and_tax_on_the_server(client, tier, fees):
    response = client.post(reverse("booking-quote"), {"tier": tier.id, "guests": 2}, format="json")

    assert response.status_code == 200
    body = response.json()
    # ₱12,000 × 2 = ₱24,000, +20% site fee, +12% tax.
    assert body["base_amount"] == 24_000_00
    assert body["site_fee_amount"] == 4_800_00
    assert body["tax_amount"] == 2_880_00
    assert body["total_amount"] == 31_680_00


def test_quote_without_a_fee_schedule_charges_the_tier_price(client, tier):
    body = client.post(
        reverse("booking-quote"), {"tier": tier.id, "guests": 1}, format="json"
    ).json()

    assert body["total_amount"] == body["base_amount"] == 12_000_00


@pytest.mark.parametrize("guests", [0, 31])
def test_quote_rejects_impossible_group_sizes(client, tier, guests):
    response = client.post(
        reverse("booking-quote"), {"tier": tier.id, "guests": guests}, format="json"
    )

    assert response.status_code == 400


def test_quote_requires_login(tier):
    response = APIClient().post(reverse("booking-quote"), {"tier": tier.id, "guests": 1})

    assert response.status_code == 403


def test_creating_a_booking_snapshots_the_price_and_holds_it(
    client, tier, fees, start_date, traveler
):
    response = book(client, tier, start_date)

    assert response.status_code == 201
    booking = Booking.objects.get(pk=response.json()["id"])
    assert booking.user == traveler
    assert booking.status == Booking.Status.PENDING_PAYMENT
    assert (booking.unit_price, booking.total_amount) == (12_000_00, 31_680_00)
    assert booking.hold_expires_at - timezone.now() <= HOLD_DURATION
    assert response.json()["is_hold_active"] is True


def test_a_later_price_change_does_not_alter_an_existing_booking(client, tier, fees, start_date):
    booking_id = book(client, tier, start_date).json()["id"]

    tier.price = 99_000_00
    tier.save()

    assert Booking.objects.get(pk=booking_id).total_amount == 31_680_00


@pytest.mark.parametrize(
    "offset_days, expected_error",
    [(-1, "future"), (900, "runs between")],
)
def test_booking_rejects_dates_outside_the_package_window(
    client, tier, start_date, offset_days, expected_error
):
    response = book(client, tier, date.today() + timedelta(days=offset_days))

    assert response.status_code == 400
    assert expected_error in str(response.json()["start_date"])


def test_booking_rejects_unpublished_packages(client, tier, start_date, package):
    package.status = Package.Status.DRAFT
    package.save()

    assert book(client, tier, start_date).status_code == 400


def test_travelers_only_see_their_own_bookings(client, tier, fees, start_date, django_user_model):
    booking_id = book(client, tier, start_date).json()["id"]
    other = django_user_model.objects.create_user(
        email="other@example.com", password="a-long-password"
    )
    other_client = APIClient()
    other_client.force_authenticate(other)

    assert len(client.get(reverse("booking-list")).json()) == 1
    assert other_client.get(reverse("booking-list")).json() == []
    assert other_client.get(reverse("booking-detail", args=[booking_id])).status_code == 404


def test_expired_holds_are_released_but_confirmed_bookings_are_kept(client, tier, fees, start_date):
    stale_id = book(client, tier, start_date).json()["id"]
    Booking.objects.filter(pk=stale_id).update(
        hold_expires_at=timezone.now() - timedelta(minutes=1)
    )
    confirmed_id = book(client, tier, start_date).json()["id"]
    Booking.objects.filter(pk=confirmed_id).update(
        status=Booking.Status.CONFIRMED, hold_expires_at=timezone.now() - timedelta(hours=2)
    )

    assert expire_stale_holds() == 1
    assert Booking.objects.get(pk=stale_id).status == Booking.Status.EXPIRED
    assert Booking.objects.get(pk=confirmed_id).status == Booking.Status.CONFIRMED
