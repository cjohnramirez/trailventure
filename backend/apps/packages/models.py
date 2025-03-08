from django.db import models
from apps.destinations.models import Destination
from cloudinary.models import CloudinaryField
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
User = get_user_model()


class Package(models.Model):
    name = models.CharField(max_length=255, unique=True, blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    host = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="package", null=True
    )
    destination = models.ForeignKey(
        Destination, on_delete=models.CASCADE, related_name="package", null=True
    )
    address = models.TextField(blank=True, null=True)
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.start_date and self.end_date and self.start_date > self.end_date:
            raise ValidationError("End date should be greater than start date.")

    def __str__(self):
        return f"Package: {self.name}"


class PackageAmenity(models.Model):
    class Meta:
        verbose_name_plural = "Package amenities"

    package = models.ForeignKey(
        Package, on_delete=models.CASCADE, related_name="package_amenity"
    )
    name = models.CharField(max_length=255, unique=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Package {self.package.name}: {self.name} "


class PackageImage(models.Model):
    image = CloudinaryField("image")
    created = models.DateTimeField(auto_now_add=True)
    package = models.ForeignKey(
        Package, related_name="package_image", on_delete=models.CASCADE, null=True
    )

    def __str__(self):
        return f"Package Image for package {self.package.name}"


class PackageType(models.Model):
    name = models.CharField(max_length=255, unique=True, blank=True, null=True)
    price_per_person = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    package = models.ForeignKey(
        Package, related_name="package_type", on_delete=models.CASCADE, null=True
    )
    description = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Package: {self.package.name}, Package Type: {self.name}"


class PackageTypeAmenity(models.Model):
    class Meta:
        verbose_name_plural = "Package type amenities"

    package_type = models.ForeignKey(
        PackageType,
        on_delete=models.CASCADE,
        related_name="package_type_amenity",
        null=True
    )
    name = models.CharField(max_length=255, unique=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Package type: {self.package_type.name}, Amenity: {self.name}"


class PackageRoutePoint(models.Model):
    class Meta:
        verbose_name_plural = "Package route points"

    package_type = models.ForeignKey(
        PackageType, on_delete=models.CASCADE, related_name="package_route_point", null=True
    )
    title = models.CharField(max_length=255)
    point_number = models.PositiveIntegerField(null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField()
    day = models.PositiveIntegerField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Package {self.package_type.name} Route Point {self.point_number}: {self.title}"
