"""Stripe is faked here: these tests check our own rules, not Stripe's."""

import json
from datetime import timedelta
from types import SimpleNamespace

import pytest
import stripe
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient

from apps.bookings.models import Booking
from apps.bookings.services import create_booking
from apps.payments.models import Payment, StripeEvent
from apps.payments.services import handle_event

SESSION_ID = "cs_test_123"
CHECKOUT_URL = "https://checkout.stripe.com/c/pay/cs_test_123"


@pytest.fixture
def client(traveler):
    api = APIClient()
    api.force_authenticate(traveler)
    return api


@pytest.fixture
def booking(traveler, tier, fees, start_date):
    return create_booking(user=traveler, tier=tier, start_date=start_date, guests=2)


@pytest.fixture
def fake_stripe(settings, monkeypatch):
    """Capture what we would send to Stripe and answer with a session."""
    settings.STRIPE_SECRET_KEY = "sk_test_fake"
    calls = []

    class FakeSessions:
        def create(self, params, options=None):
            calls.append({"params": params, "options": options})
            return SimpleNamespace(id=SESSION_ID, url=CHECKOUT_URL)

    monkeypatch.setattr(
        "apps.payments.services.stripe.StripeClient",
        lambda key: SimpleNamespace(checkout=SimpleNamespace(sessions=FakeSessions())),
    )
    return calls


def test_checkout_sends_the_server_side_total_and_returns_the_url(client, booking, fake_stripe):
    response = client.post(reverse("booking-checkout", args=[booking.id]))

    assert response.status_code == 200
    assert response.json()["checkout_url"] == CHECKOUT_URL
    sent = fake_stripe[0]
    line_item = sent["params"]["line_items"][0]
    assert line_item["price_data"]["unit_amount"] == booking.total_amount
    assert line_item["price_data"]["currency"] == "php"
    assert sent["params"]["metadata"] == {"booking_id": str(booking.id)}
    assert sent["options"]["idempotency_key"] == f"booking-{booking.id}"
    payment = Payment.objects.get(checkout_session_id=SESSION_ID)
    assert (payment.booking, payment.amount, payment.status) == (
        booking,
        booking.total_amount,
        Payment.Status.PENDING,
    )


def test_checkout_is_refused_for_someone_elses_booking(booking, fake_stripe, django_user_model):
    other = django_user_model.objects.create_user(
        email="thief@example.com", password="a-long-password"
    )
    api = APIClient()
    api.force_authenticate(other)

    assert api.post(reverse("booking-checkout", args=[booking.id])).status_code == 403


def test_checkout_is_refused_once_the_hold_expired(client, booking, fake_stripe):
    Booking.objects.filter(pk=booking.pk).update(
        hold_expires_at=timezone.now() - timedelta(minutes=1)
    )

    response = client.post(reverse("booking-checkout", args=[booking.id]))

    assert response.status_code == 400
    assert "hold has expired" in str(response.json())


def test_checkout_without_stripe_keys_reports_a_clear_error(client, booking, settings):
    settings.STRIPE_SECRET_KEY = ""

    assert client.post(reverse("booking-checkout", args=[booking.id])).status_code == 503


def make_event(event_type: str, obj: dict, event_id: str = "evt_1") -> dict:
    return {"id": event_id, "type": event_type, "data": {"object": obj}}


def session_payload(payment_status="paid", session_id=SESSION_ID):
    return {"id": session_id, "payment_status": payment_status, "payment_intent": "pi_123"}


@pytest.fixture
def payment(booking):
    return Payment.objects.create(
        booking=booking, checkout_session_id=SESSION_ID, amount=booking.total_amount
    )


def test_paid_session_confirms_the_booking(payment):
    assert handle_event(make_event("checkout.session.completed", session_payload())) == "confirmed"

    payment.refresh_from_db()
    payment.booking.refresh_from_db()
    assert payment.status == Payment.Status.PAID
    assert payment.payment_intent_id == "pi_123"
    assert payment.booking.status == Booking.Status.CONFIRMED
    assert payment.booking.confirmed_at is not None


def test_replaying_the_same_event_changes_nothing(payment):
    event = make_event("checkout.session.completed", session_payload())
    handle_event(event)

    assert handle_event(event) == "duplicate"
    assert StripeEvent.objects.count() == 1


def test_unpaid_completed_session_waits_instead_of_confirming(payment):
    outcome = handle_event(
        make_event("checkout.session.completed", session_payload(payment_status="unpaid"))
    )

    payment.booking.refresh_from_db()
    assert outcome == "awaiting-payment"
    assert payment.booking.status == Booking.Status.PENDING_PAYMENT


def test_async_payment_success_confirms_a_delayed_payment(payment):
    handle_event(make_event("checkout.session.completed", session_payload(payment_status="unpaid")))

    outcome = handle_event(
        make_event("checkout.session.async_payment_succeeded", session_payload(), event_id="evt_2")
    )

    payment.booking.refresh_from_db()
    assert outcome == "confirmed"
    assert payment.booking.status == Booking.Status.CONFIRMED


def test_expired_session_releases_the_booking(payment):
    assert handle_event(make_event("checkout.session.expired", session_payload())) == "expired"

    payment.refresh_from_db()
    payment.booking.refresh_from_db()
    assert payment.status == Payment.Status.EXPIRED
    assert payment.booking.status == Booking.Status.EXPIRED


def test_failed_async_payment_marks_the_payment_failed(payment):
    assert (
        handle_event(make_event("checkout.session.async_payment_failed", session_payload()))
        == "failed"
    )

    payment.refresh_from_db()
    assert payment.status == Payment.Status.FAILED
    assert payment.booking.status == Booking.Status.PENDING_PAYMENT


def test_refund_marks_the_booking_refunded(payment):
    handle_event(make_event("checkout.session.completed", session_payload()))

    outcome = handle_event(
        make_event(
            "charge.refunded",
            {"payment_intent": "pi_123", "refunds": {"data": [{"id": "re_1"}]}},
            event_id="evt_3",
        )
    )

    payment.refresh_from_db()
    payment.booking.refresh_from_db()
    assert outcome == "refunded"
    assert (payment.status, payment.refund_id) == (Payment.Status.REFUNDED, "re_1")
    assert payment.booking.status == Booking.Status.REFUNDED


def test_unrelated_events_are_recorded_but_ignored(db):
    assert handle_event(make_event("customer.created", {"id": "cus_1"})) == "ignored"
    assert StripeEvent.objects.get(event_id="evt_1").processed_at is not None


def signed_request(api, payload: dict, secret: str, *, timestamp: int | None = None):
    body = json.dumps(payload)
    timestamp = timestamp or int(timezone.now().timestamp())
    signature = stripe.WebhookSignature._compute_signature(f"{timestamp}.{body}", secret)
    return api.post(
        reverse("stripe-webhook"),
        data=body,
        content_type="application/json",
        HTTP_STRIPE_SIGNATURE=f"t={timestamp},v1={signature}",
    )


def test_webhook_accepts_a_correctly_signed_event(payment, settings):
    settings.STRIPE_WEBHOOK_SECRET = "whsec_test"

    response = signed_request(
        APIClient(), make_event("checkout.session.completed", session_payload()), "whsec_test"
    )

    payment.booking.refresh_from_db()
    assert response.status_code == 200
    assert response.json()["outcome"] == "confirmed"
    assert payment.booking.status == Booking.Status.CONFIRMED


def test_webhook_rejects_a_wrong_signature(payment, settings):
    settings.STRIPE_WEBHOOK_SECRET = "whsec_test"

    response = signed_request(
        APIClient(), make_event("checkout.session.completed", session_payload()), "whsec_attacker"
    )

    payment.booking.refresh_from_db()
    assert response.status_code == 400
    assert payment.booking.status == Booking.Status.PENDING_PAYMENT
    assert StripeEvent.objects.count() == 0


def test_webhook_rejects_an_unsigned_request(db, settings):
    settings.STRIPE_WEBHOOK_SECRET = "whsec_test"

    response = APIClient().post(
        reverse("stripe-webhook"),
        data=json.dumps(make_event("checkout.session.completed", session_payload())),
        content_type="application/json",
    )

    assert response.status_code == 400
