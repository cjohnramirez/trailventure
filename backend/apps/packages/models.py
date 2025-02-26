from django.db import models
from apps.destinations.models import Destination
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model

User = get_user_model()

class PackageImage(models.Model):
    image = models.ImageField(upload_to="Package_images/")
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Package Image for Package: {self.Package.name}"


class Package(models.Model):
    name = models.CharField(max_length=255, unique=True, blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    host = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="Package", null=True
    )
    package_image = models.ForeignKey(
        PackageImage, on_delete=models.CASCADE, related_name="Package", null=True
    )
    destination = models.ForeignKey(
        Destination, on_delete=models.CASCADE, related_name="Package", null=True
    )
    address = models.TextField(blank=True, null=True)
    currency = models.CharField(max_length=3, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.end_date <= self.start_date:
            raise ValidationError("End date must be after the start date.")

    def __str__(self):
        return f"Package: {self.name}"


class PackageRoutePoint(models.Model):
    class Meta:
        verbose_name_plural = "Package route points"
    
    package = models.ForeignKey(
        Package,
        on_delete=models.CASCADE,
        related_name="itineraries"
    )
    title = models.CharField(max_length=255)
    point_number = models.PositiveIntegerField(null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField()
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    count = 0
    def __str__(self):
        return f"Package {self.package.name} Route Point {self.point_number}: {self.title}"



class PackageAmenity(models.Model):
    class Meta:
        verbose_name_plural = "Package amenities"

    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Package Amenity: {self.name}"


class PackageType(models.Model):
    name = models.CharField(max_length=255, unique=True, blank=True, null=True)
    price_per_person = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    package = models.ForeignKey(
        Package, on_delete=models.CASCADE, related_name="Package", null=True
    )
    package_amenity = models.ForeignKey(
        PackageAmenity, on_delete=models.CASCADE, related_name="Package", null=True
    )
    description = models.TextField()
    icon_name = models.CharField(max_length=255, unique=False, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Package Type: {self.name}"
