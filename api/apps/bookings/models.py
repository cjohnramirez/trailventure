import uuid

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone

from apps.catalog.models import Package, Tier

MAX_GUESTS = 30


class FeeSchedule(models.Model):
    """Site fee and tax percentages. Exactly one row is active; bookings snapshot its values."""

    tax_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    site_fee_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["is_active"],
                condition=models.Q(is_active=True),
                name="bookings_single_active_fee_schedule",
            )
        ]

    def __str__(self):
        return f"Tax {self.tax_percent}% · site fee {self.site_fee_percent}%"


class Booking(models.Model):
    """A traveler's booking of one package tier.

    Money is stored in centavos, snapshotted when the booking is created so later price or fee
    changes never alter an existing booking. `hold_expires_at` gives the traveler a window to pay;
    unpaid bookings expire instead of being deleted (the original site deleted them over GET).
    """

    class Status(models.TextChoices):
        PENDING_PAYMENT = "pending_payment", "Pending payment"
        CONFIRMED = "confirmed", "Confirmed"
        EXPIRED = "expired", "Expired"
        CANCELLED = "cancelled", "Cancelled"
        REFUNDED = "refunded", "Refunded"

    #: Statuses that still allow a checkout attempt.
    OPEN_STATUSES = (Status.PENDING_PAYMENT,)

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="bookings"
    )
    package = models.ForeignKey(Package, on_delete=models.PROTECT, related_name="bookings")
    tier = models.ForeignKey(Tier, on_delete=models.PROTECT, related_name="bookings")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING_PAYMENT)

    start_date = models.DateField()
    guests = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(MAX_GUESTS)]
    )

    # Price snapshot, all in centavos.
    unit_price = models.PositiveIntegerField()
    base_amount = models.PositiveIntegerField()
    site_fee_amount = models.PositiveIntegerField()
    tax_amount = models.PositiveIntegerField()
    total_amount = models.PositiveIntegerField()
    tax_percent = models.DecimalField(max_digits=5, decimal_places=2)
    site_fee_percent = models.DecimalField(max_digits=5, decimal_places=2)

    hold_expires_at = models.DateTimeField()
    confirmed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "-created_at"]),
            models.Index(fields=["status", "hold_expires_at"]),
        ]

    def __str__(self):
        return f"{self.package} · {self.get_status_display()}"

    @property
    def is_hold_active(self) -> bool:
        return self.status == self.Status.PENDING_PAYMENT and self.hold_expires_at > timezone.now()
