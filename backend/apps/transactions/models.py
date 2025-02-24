import stripe
from django.db import models
from apps.properties.models import Property
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model

User = get_user_model()

class AdditionalFees(models.Model):
    tax_paid_percent = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00
    )
    site_fees = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Tax: {self.tax_paid_percent}%, Site Fees: {self.site_fees}"


class Currencies(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False)
    code = models.CharField(max_length=255, blank=False, null=False)
    icon_image = models.CharField(max_length=255)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    STATUS_CHOICES = [
        (1, "Active"),
        (0, "Inactive"),
    ]
    status = models.BooleanField(default=True)

    def __str__(self):
        return f"Currency: {self.name}"


class Booking(models.Model):
    property = models.OneToOneField(
        Property, on_delete=models.CASCADE, related_name="booking", null=True
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="booking", null=True
    )
    check_in_date = models.DateTimeField(null=False, blank=False)
    check_out_date = models.DateTimeField(null=False, blank=False)
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    is_refund = models.BooleanField(default=False, blank=True)
    is_confirmed = models.BooleanField(default=False, blank=True)
    cancel_date = models.DateTimeField(null=True)
    refund_paid = models.DecimalField(max_digits=10, default=0.00, decimal_places=2)
    booking_date = models.DateTimeField(auto_now_add=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.check_out_date <= self.check_in_date:
            raise ValidationError("Check-out date must be after check-in date.")

    def __str__(self):
        return f"Booking id: {self.id}"


class Transaction(models.Model):
    additional_fees = models.ForeignKey(
        AdditionalFees,
        on_delete=models.CASCADE,
        related_name="transaction",
        null=True,
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="transaction", null=True
    )
    booking = models.ForeignKey(
        Booking, on_delete=models.CASCADE, related_name="transaction", null=True
    )
    currency = models.ForeignKey(
        Currencies, 
        on_delete=models.CASCADE,
        related_name="transaction",
        null=True
    )
    status_choices = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]
    status = models.CharField(max_length=10, choices=status_choices, default="pending")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transfer_date = models.DateTimeField(auto_now_add=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def verify_if_confirmed(self):
        if not self.booking.is_confirmed:
            raise ValidationError("Booking not yet confirmed by the host")

    def __str__(self):
        return f"Transaction id: {self.id}"
