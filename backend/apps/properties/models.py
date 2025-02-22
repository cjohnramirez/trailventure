from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

from django.core.validators import MinValueValidator, MaxValueValidator

class PropertyType(models.Model):
    name = models.CharField(max_length=255, unique=True, blank=False, null=False)
    icon_image = models.FileField(
        upload_to="static/images", unique=False, blank=False, null=False
    )
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

class Property(models.Model):
    name = models.CharField(max_length=255, unique=True, blank=False, null=False)
    description = models.TextField(blank=True, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
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
    minimum_stay = models.PositiveIntegerField(blank=False, null=False)
    refund_type = models.PositiveSmallIntegerField(blank=False, null=False)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Property: {self.name}"


class PropertyReview(models.Model):
    property_id = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
    )
    review_by_user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
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


class PropertyImage(models.Model):
    property_id = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
    )
    added_by_user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
    )
    image = models.ImageField(upload_to="static/property_images/")
    created = models.DateTimeField(auto_now_add=True)
