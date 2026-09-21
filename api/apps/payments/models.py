from django.db import models

from apps.bookings.models import Booking


class Payment(models.Model):
    """A Stripe Checkout attempt for a booking."""

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        FAILED = "failed", "Failed"
        EXPIRED = "expired", "Expired"
        REFUNDED = "refunded", "Refunded"

    booking = models.ForeignKey(Booking, on_delete=models.PROTECT, related_name="payments")
    checkout_session_id = models.CharField(max_length=255, unique=True)
    payment_intent_id = models.CharField(max_length=255, blank=True)
    refund_id = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)
    amount = models.PositiveIntegerField(help_text="Charged amount in centavos.")
    currency = models.CharField(max_length=3, default="PHP")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.checkout_session_id} · {self.get_status_display()}"


class StripeEvent(models.Model):
    """Every webhook event Stripe delivered, so replays are ignored (Stripe retries by design)."""

    event_id = models.CharField(max_length=255, unique=True)
    event_type = models.CharField(max_length=100)
    received_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-received_at"]

    def __str__(self):
        return f"{self.event_type} ({self.event_id})"
