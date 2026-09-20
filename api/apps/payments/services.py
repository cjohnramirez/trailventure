"""Stripe Checkout, behind a thin layer so the rest of the app never touches Stripe directly."""

import logging
from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any

import stripe
from django.conf import settings
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import APIException, ValidationError

from apps.bookings.models import Booking
from apps.bookings.services import confirm_booking, expire_booking

from .models import Payment, StripeEvent

logger = logging.getLogger(__name__)

CURRENCY = "php"
#: Stripe expires unpaid Checkout sessions; keep it inside the booking hold.
SESSION_TTL_MINUTES = 30


@dataclass(frozen=True)
class CheckoutSession:
    """A started Checkout: the stored payment plus the URL to send the traveler to."""

    payment: Payment
    url: str


class PaymentsUnavailable(APIException):
    status_code = 503
    default_detail = "Payments are not available right now. Please try again shortly."
    default_code = "payments_unavailable"


def stripe_enabled() -> bool:
    return bool(settings.STRIPE_SECRET_KEY)


def _client() -> stripe.StripeClient:
    if not stripe_enabled():
        raise PaymentsUnavailable()
    return stripe.StripeClient(settings.STRIPE_SECRET_KEY)


def create_checkout_session(
    *, booking: Booking, success_url: str, cancel_url: str
) -> CheckoutSession:
    """Start a Checkout session for a booking that is still holding its price."""
    if booking.status not in Booking.OPEN_STATUSES:
        raise ValidationError({"booking": "This booking can no longer be paid for."})
    if not booking.is_hold_active:
        raise ValidationError({"booking": "This booking’s hold has expired. Start a new booking."})

    client = _client()
    try:
        session = client.checkout.sessions.create(
            params={
                "mode": "payment",
                "client_reference_id": str(booking.id),
                "customer_email": booking.user.email,
                "metadata": {"booking_id": str(booking.id)},
                "expires_at": int((booking.hold_expires_at).timestamp()),
                "success_url": success_url,
                "cancel_url": cancel_url,
                "line_items": [
                    {
                        "quantity": 1,
                        "price_data": {
                            "currency": CURRENCY,
                            # The server's snapshot is the only price Stripe ever sees.
                            "unit_amount": booking.total_amount,
                            "product_data": {
                                "name": f"{booking.package.name} · {booking.tier.name}",
                                "description": (
                                    f"{booking.guests} traveler(s), starting {booking.start_date}"
                                ),
                            },
                        },
                    }
                ],
            },
            # Retrying the same booking reuses the session instead of charging twice.
            options={"idempotency_key": f"booking-{booking.id}"},
        )
    except stripe.StripeError:
        logger.exception("Stripe checkout session failed for booking %s", booking.id)
        raise PaymentsUnavailable() from None

    payment, _ = Payment.objects.update_or_create(
        checkout_session_id=session.id,
        defaults={
            "booking": booking,
            "amount": booking.total_amount,
            "currency": CURRENCY.upper(),
            "status": Payment.Status.PENDING,
        },
    )
    if not session.url:
        logger.error("Stripe session %s came back without a URL", session.id)
        raise PaymentsUnavailable()
    return CheckoutSession(payment=payment, url=session.url)


def verify_webhook(payload: bytes, signature: str) -> stripe.Event:
    if not settings.STRIPE_WEBHOOK_SECRET:
        raise PaymentsUnavailable()
    return stripe.Webhook.construct_event(payload, signature, settings.STRIPE_WEBHOOK_SECRET)


@transaction.atomic
def handle_event(event: stripe.Event | Mapping[str, Any]) -> str:
    """Apply a verified Stripe event. Returns what happened, for logging.

    Replays are ignored: the event id is inserted first, and a duplicate insert means this event
    was already applied.
    """
    event_id, event_type = _field(event, "id"), _field(event, "type")
    _, created = StripeEvent.objects.get_or_create(
        event_id=event_id, defaults={"event_type": event_type}
    )
    if not created:
        return "duplicate"

    handler = {
        "checkout.session.completed": _handle_session_completed,
        "checkout.session.async_payment_succeeded": _handle_session_completed,
        "checkout.session.expired": _handle_session_expired,
        "checkout.session.async_payment_failed": _handle_session_failed,
        "charge.refunded": _handle_charge_refunded,
    }.get(event_type)

    outcome = handler(_field(_field(event, "data"), "object")) if handler else "ignored"
    StripeEvent.objects.filter(event_id=event_id).update(processed_at=timezone.now())
    return outcome


def _field(obj, key: str, default=None):
    """Read a field from a Stripe object or a plain dict (StripeObject has no `.get`)."""
    try:
        return obj[key]
    except (KeyError, AttributeError, TypeError):
        return default


def _payment_for_session(session) -> Payment | None:
    return (
        Payment.objects.select_for_update()
        .select_related("booking")
        .filter(checkout_session_id=_field(session, "id"))
        .first()
    )


def _handle_session_completed(session) -> str:
    payment = _payment_for_session(session)
    if payment is None:
        logger.warning("Stripe session %s has no payment row", _field(session, "id"))
        return "unknown-session"

    payment.payment_intent_id = _field(session, "payment_intent") or ""
    if _field(session, "payment_status") != "paid":
        # Delayed payment methods: stay pending until async_payment_succeeded arrives.
        payment.save(update_fields=["payment_intent_id", "updated_at"])
        return "awaiting-payment"

    payment.status = Payment.Status.PAID
    payment.save(update_fields=["status", "payment_intent_id", "updated_at"])
    confirm_booking(payment.booking)
    return "confirmed"


def _handle_session_expired(session) -> str:
    payment = _payment_for_session(session)
    if payment is None:
        return "unknown-session"
    payment.status = Payment.Status.EXPIRED
    payment.save(update_fields=["status", "updated_at"])
    expire_booking(payment.booking)
    return "expired"


def _handle_session_failed(session) -> str:
    payment = _payment_for_session(session)
    if payment is None:
        return "unknown-session"
    payment.status = Payment.Status.FAILED
    payment.save(update_fields=["status", "updated_at"])
    return "failed"


def _handle_charge_refunded(charge) -> str:
    payment = (
        Payment.objects.select_for_update()
        .select_related("booking")
        .filter(payment_intent_id=_field(charge, "payment_intent") or "")
        .first()
    )
    if payment is None:
        return "unknown-charge"
    payment.status = Payment.Status.REFUNDED
    refunds = _field(_field(charge, "refunds", {}), "data") or [{}]
    payment.refund_id = _field(refunds[0], "id") or ""
    payment.save(update_fields=["status", "refund_id", "updated_at"])
    booking = payment.booking
    booking.status = Booking.Status.REFUNDED
    booking.save(update_fields=["status", "updated_at"])
    return "refunded"
