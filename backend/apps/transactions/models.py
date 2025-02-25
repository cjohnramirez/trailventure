from django.db import models
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from rest_framework.exceptions import ValidationError
from apps.packages.models import PackageType

User = get_user_model()



class AdditionalFees(models.Model):
    class Meta:
        verbose_name_plural = "additional fees"

    tax_paid_percent = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00
    )
    site_fees = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Tax: {self.tax_paid_percent}%, Site Fees: {self.site_fees}"


class Booking(models.Model):
    package_type = models.ForeignKey(
        PackageType, on_delete=models.CASCADE, related_name="booking", null=True
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="booking", null=True
    )
    num_of_person = models.PositiveIntegerField()
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    is_confirmed = models.BooleanField(default=False, blank=True)
    cancel_date = models.DateTimeField(null=True)
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
    booking = models.ForeignKey(
        Booking, on_delete=models.CASCADE, related_name="transaction", null=True
    )
    currency = models.CharField(max_length=3, blank=True, null=True)
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

class PackageReview(models.Model):
    class Meta:
        verbose_name_plural = "package reviews"

    review_by_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="package_review", null=True
    )
    transaction = models.ForeignKey(
        Transaction, on_delete=models.CASCADE, related_name="package_review", null=True
    )
    comment = models.TextField()
    rating = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        blank=False,
        null=False,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def clean(self):
        if not Booking.objects.filter(
            user=self.review_by_user, Package=self.Package
        ).exists():
            raise ValidationError(
                "User must have booked this Package before reviewing."
            )

    def __str__(self):
        return f"Package: {self.Package.name}, User: {self.review_by_user.username}"