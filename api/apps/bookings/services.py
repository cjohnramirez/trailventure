from dataclasses import asdict, dataclass
from datetime import date, timedelta
from decimal import ROUND_HALF_UP, Decimal

from django.db import transaction
from django.utils import timezone
from django.utils.formats import date_format
from rest_framework.exceptions import ValidationError

from apps.catalog.models import Package, Tier

from .models import MAX_GUESTS, Booking, FeeSchedule

#: How long a traveler has to pay before the booking expires.
HOLD_DURATION = timedelta(minutes=30)


@dataclass(frozen=True)
class Quote:
    """Server-calculated price breakdown, in centavos."""

    unit_price: int
    guests: int
    base_amount: int
    site_fee_amount: int
    tax_amount: int
    total_amount: int
    tax_percent: Decimal
    site_fee_percent: Decimal

    def as_dict(self) -> dict:
        return asdict(self)


def active_fee_schedule() -> FeeSchedule:
    schedule = FeeSchedule.objects.filter(is_active=True).order_by("-created_at").first()
    # A missing fee row must not break bookings: charge the tier price with no fees.
    return schedule or FeeSchedule(tax_percent=Decimal("0"), site_fee_percent=Decimal("0"))


def _percent_of(amount: int, percent: Decimal) -> int:
    """Percentage of a centavo amount, rounded to the nearest centavo (half up)."""
    return int((Decimal(amount) * percent / Decimal(100)).quantize(Decimal("1"), ROUND_HALF_UP))


def build_quote(*, tier: Tier, guests: int) -> Quote:
    if guests < 1 or guests > MAX_GUESTS:
        raise ValidationError({"guests": f"Choose between 1 and {MAX_GUESTS} travelers."})

    fees = active_fee_schedule()
    base_amount = tier.price * guests
    site_fee_amount = _percent_of(base_amount, fees.site_fee_percent)
    tax_amount = _percent_of(base_amount, fees.tax_percent)
    return Quote(
        unit_price=tier.price,
        guests=guests,
        base_amount=base_amount,
        site_fee_amount=site_fee_amount,
        tax_amount=tax_amount,
        total_amount=base_amount + site_fee_amount + tax_amount,
        tax_percent=fees.tax_percent,
        site_fee_percent=fees.site_fee_percent,
    )


def validate_start_date(*, package: Package, start_date: date) -> None:
    today = timezone.localdate()
    if start_date < today:
        raise ValidationError({"start_date": "Choose a start date in the future."})
    if not (package.available_from <= start_date <= package.available_until):
        raise ValidationError(
            {
                "start_date": (
                    "This package runs between "
                    f"{date_format(package.available_from, 'M j, Y')} and "
                    f"{date_format(package.available_until, 'M j, Y')}."
                )
            }
        )


@transaction.atomic
def create_booking(*, user, tier: Tier, start_date: date, guests: int) -> Booking:
    """Create a pending booking holding today's price for HOLD_DURATION."""
    package = tier.package
    if package.status != Package.Status.PUBLISHED:
        raise ValidationError({"tier": "This package isn’t available to book."})
    validate_start_date(package=package, start_date=start_date)

    quote = build_quote(tier=tier, guests=guests)
    return Booking.objects.create(
        user=user,
        package=package,
        tier=tier,
        start_date=start_date,
        guests=guests,
        unit_price=quote.unit_price,
        base_amount=quote.base_amount,
        site_fee_amount=quote.site_fee_amount,
        tax_amount=quote.tax_amount,
        total_amount=quote.total_amount,
        tax_percent=quote.tax_percent,
        site_fee_percent=quote.site_fee_percent,
        hold_expires_at=timezone.now() + HOLD_DURATION,
    )


def confirm_booking(booking: Booking) -> Booking:
    """Mark a booking paid. Safe to call repeatedly (Stripe retries webhooks)."""
    if booking.status == Booking.Status.CONFIRMED:
        return booking
    booking.status = Booking.Status.CONFIRMED
    booking.confirmed_at = timezone.now()
    booking.save(update_fields=["status", "confirmed_at", "updated_at"])
    return booking


def expire_booking(booking: Booking) -> Booking:
    """Expire an unpaid booking. Confirmed bookings are never touched."""
    if booking.status != Booking.Status.PENDING_PAYMENT:
        return booking
    booking.status = Booking.Status.EXPIRED
    booking.save(update_fields=["status", "updated_at"])
    return booking


def expire_stale_holds() -> int:
    """Expire bookings whose hold ran out. Returns how many were expired."""
    return Booking.objects.filter(
        status=Booking.Status.PENDING_PAYMENT, hold_expires_at__lt=timezone.now()
    ).update(status=Booking.Status.EXPIRED, updated_at=timezone.now())
