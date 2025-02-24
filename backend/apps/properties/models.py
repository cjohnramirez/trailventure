from django.db import models
from apps.categories.models import PropertyType, PropertyAmenityType
from apps.transactions.models import Currencies, Booking
from apps.destinations.models import Province, City, Country
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
User = get_user_model()

from django.core.validators import MinValueValidator, MaxValueValidator

class PropertyAmenity(models.Model):
    property_amenity_type = models.ForeignKey(
        PropertyAmenityType,
        on_delete=models.CASCADE,
        related_name="property_amenity",
        null=True
    )
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"http://localhost:8000/"


class Property(models.Model):
    name = models.CharField(max_length=255, unique=True, blank=False, null=False)
    description = models.TextField(blank=True, null=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="property", null=True
    )
    property_type = models.ForeignKey(
        PropertyType, on_delete=models.CASCADE, related_name="property", null=True
    )
    property_image = models.ForeignKey(
        PropertyImage, on_delete=models.CASCADE, related_name="property", null=True
    )
    property_amenity = models.ForeignKey(
        PropertyAmenity,
        on_delete=models.CASCADE,
        related_name="property",
        null=True
    )
    country = models.ForeignKey(
        Country, on_delete=models.CASCADE, related_name="property", null=True
    )
    province = models.ForeignKey(
        Province, on_delete=models.CASCADE, related_name="property", null=True
    )
    city = models.ForeignKey(
        City, on_delete=models.CASCADE, related_name="property", null=True
    )
    address = models.TextField(blank=True, null=False)
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, unique=False, blank=False, null=False
    )
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, unique=False, blank=False, null=False
    )
    bedroom_count = models.PositiveIntegerField(blank=False, null=False)
    bed_count = models.PositiveIntegerField(blank=False, null=False)
    bathroom_count = models.PositiveIntegerField(blank=False, null=False)
    start_date = models.DateField()
    end_date = models.DateField()
    price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=False, null=False
    )
    currency = models.ForeignKey(
        Currencies, on_delete=models.CASCADE, related_name="property_currency", null=True
    )
    minimum_stay = models.PositiveIntegerField(blank=False, null=False)
    refund_type = models.PositiveSmallIntegerField(blank=False, null=False)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.end_date <= self.start_date:
            raise ValidationError("End date must be after the start date.")

    def __str__(self):
        return f"Property: {self.name}"


class PropertyReview(models.Model):
    review_by_user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="property_review", null=True
    )
    booking = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,
        related_name="property_review", null=True
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
        if not Booking.objects.filter(user=self.review_by_user, property=self.property).exists():
            raise ValidationError("User must have booked this property before reviewing.")

    def __str__(self):
        return f"Property: {self.property.name}, User: {self.review_by_user.username}"
