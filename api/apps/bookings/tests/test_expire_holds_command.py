from datetime import timedelta
from io import StringIO

from django.core.management import call_command
from django.utils import timezone

from apps.bookings import services
from apps.bookings.models import Booking


def test_the_command_expires_stale_holds(traveler, tier, fees, start_date):
    booking = services.create_booking(user=traveler, tier=tier, start_date=start_date, guests=2)
    booking.hold_expires_at = timezone.now() - timedelta(minutes=1)
    booking.save(update_fields=["hold_expires_at"])
    out = StringIO()

    call_command("expire_holds", stdout=out)

    assert "Expired 1 stale booking hold(s)." in out.getvalue()
    booking.refresh_from_db()
    assert booking.status == Booking.Status.EXPIRED


def test_the_command_leaves_live_holds_alone(traveler, tier, fees, start_date):
    booking = services.create_booking(user=traveler, tier=tier, start_date=start_date, guests=2)
    out = StringIO()

    call_command("expire_holds", stdout=out)

    assert "Expired 0 stale booking hold(s)." in out.getvalue()
    booking.refresh_from_db()
    assert booking.status == Booking.Status.PENDING_PAYMENT
