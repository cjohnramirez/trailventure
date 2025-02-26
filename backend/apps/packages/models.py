from django.db import models
from apps.destinations.models import Destination
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model

User = get_user_model()


class PackageAmenity(models.Model):
    class Meta:
        verbose_name_plural = "Package amenities"

    name = models.CharField(max_length=255, unique=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        related_package = self.package.all()
        package_names = ", ".join(pt.name for pt in related_package)

        return (
            f'{self.name}: For package "{package_names}"'
            if package_names
            else self.name
        )


class Package(models.Model):
    name = models.CharField(max_length=255, unique=True, blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    host = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="package", null=True
    )
    destination = models.ForeignKey(
        Destination, on_delete=models.CASCADE, related_name="package", null=True
    )
    package_amenity = models.ManyToManyField(PackageAmenity, related_name="package")
    address = models.TextField(blank=True, null=True)
    currency = models.CharField(max_length=3, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Package: {self.name}"


class PackageImage(models.Model):
    image = models.ImageField(upload_to="package_images/")
    created = models.DateTimeField(auto_now_add=True)
    package = models.ForeignKey(
        Package, related_name="package_image", on_delete=models.CASCADE, null=True
    )

    def __str__(self):
        return f"Package Image for package {self.package.name}"


class PackageTypeAmenity(models.Model):
    class Meta:
        verbose_name_plural = "Package type amenities"

    name = models.CharField(max_length=255, unique=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        related_package_types = self.package_type.all()
        package_type_names = ", ".join(pt.name for pt in related_package_types)

        return (
            f'{self.name}: For package "{package_type_names}"'
            if package_type_names
            else self.name
        )


class PackageType(models.Model):
    name = models.CharField(max_length=255, unique=True, blank=True, null=True)
    price_per_person = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    package = models.ForeignKey(
        Package, on_delete=models.CASCADE, related_name="package_type", null=True
    )
    package_type_amenity = models.ManyToManyField(
        PackageTypeAmenity, related_name="package_type"
    )
    description = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Package Type: {self.name}"


class PackageRoutePoint(models.Model):
    class Meta:
        verbose_name_plural = "Package route points"

    package_type = models.ForeignKey(
        PackageType, on_delete=models.CASCADE, related_name="itineraries", null=True
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

    count = 0

    def __str__(self):
        return (
            f"Package {self.package_type.name} Route Point {self.point_number}: {self.title}"
        )
