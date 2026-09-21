from datetime import timedelta

import pytest
from django.urls import reverse
from django.utils import timezone

from apps.bookings import services
from apps.bookings.models import Booking

URL_NAME = "booking-expire-holds"
KEY = "a-long-shared-cron-key"


@pytest.fixture
def stale_booking(traveler, tier, fees, start_date):
    booking = services.create_booking(user=traveler, tier=tier, start_date=start_date, guests=2)
    booking.hold_expires_at = timezone.now() - timedelta(minutes=1)
    booking.save(update_fields=["hold_expires_at"])
    return booking


def test_the_endpoint_is_invisible_until_a_key_is_configured(client, settings):
    settings.CRON_SECRET = ""

    assert client.post(reverse(URL_NAME)).status_code == 404


def test_a_wrong_key_is_refused(client, settings, stale_booking):
    settings.CRON_SECRET = KEY

    response = client.post(reverse(URL_NAME), headers={"X-Cron-Key": "guess"})

    assert response.status_code == 403
    stale_booking.refresh_from_db()
    assert stale_booking.status == Booking.Status.PENDING_PAYMENT


def test_a_missing_key_is_refused(client, settings, stale_booking):
    settings.CRON_SECRET = KEY

    assert client.post(reverse(URL_NAME)).status_code == 403


def test_the_right_key_expires_stale_holds(client, settings, stale_booking):
    settings.CRON_SECRET = KEY

    response = client.post(reverse(URL_NAME), headers={"X-Cron-Key": KEY})

    assert response.status_code == 200
    assert response.json() == {"expired": 1}
    stale_booking.refresh_from_db()
    assert stale_booking.status == Booking.Status.EXPIRED


def test_a_live_hold_is_left_alone(client, settings, traveler, tier, fees, start_date):
    settings.CRON_SECRET = KEY
    booking = services.create_booking(user=traveler, tier=tier, start_date=start_date, guests=2)

    response = client.post(reverse(URL_NAME), headers={"X-Cron-Key": KEY})

    assert response.json() == {"expired": 0}
    booking.refresh_from_db()
    assert booking.status == Booking.Status.PENDING_PAYMENT
