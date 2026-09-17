from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import Q


class Photo(models.Model):
    """Photo fields shared by destinations and package images.

    `image` is a storage key: a Cloudinary public ID, or a static path when Cloudinary isn't
    configured (see apps.core.images). Seed photos come from Unsplash, so the photographer credit
    is kept alongside.
    """

    image = models.CharField(max_length=255)
    alt_text = models.CharField(max_length=255)
    credit_name = models.CharField(max_length=150, blank=True)
    credit_url = models.URLField(max_length=500, blank=True)

    class Meta:
        abstract = True


class Destination(Photo):
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, unique=True)
    region = models.CharField(max_length=120)
    country = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    # Position in the home page bento grid; null means not featured.
    featured_order = models.PositiveSmallIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["featured_order", "name"]

    def __str__(self):
        return self.name


class Amenity(models.Model):
    name = models.CharField(max_length=120, unique=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "amenities"

    def __str__(self):
        return self.name


class Package(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"
        ARCHIVED = "archived", "Archived"

    # Hosts manage their own packages in Phase B; seeded packages have no host.
    host = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="packages",
    )
    destination = models.ForeignKey(Destination, on_delete=models.PROTECT, related_name="packages")
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    description = models.TextField()
    address = models.CharField(max_length=255)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PUBLISHED)
    # Window in which trips can start (per-date departures replace this in Phase B).
    available_from = models.DateField()
    available_until = models.DateField()
    amenities = models.ManyToManyField(Amenity, blank=True, related_name="packages")
    # Denormalized for search filters and cards; kept in sync by services.refresh_package_pricing.
    min_price = models.PositiveIntegerField(default=0, help_text="Cheapest tier, in centavos.")
    # Denormalized from reviews (M6).
    rating_avg = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    rating_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        indexes = [
            models.Index(fields=["status", "min_price"]),
            models.Index(fields=["status", "rating_avg"]),
            models.Index(fields=["available_from", "available_until"]),
        ]
        constraints = [
            models.CheckConstraint(
                condition=Q(available_until__gte=models.F("available_from")),
                name="catalog_package_window_order",
            ),
        ]

    def __str__(self):
        return self.name


class PackageImage(Photo):
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name="images")
    position = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["position", "id"]

    def __str__(self):
        return f"{self.package} · image {self.position + 1}"


class Tier(models.Model):
    """A priced variant of a package (the original site's "package type")."""

    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name="tiers")
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    price = models.PositiveIntegerField(
        validators=[MinValueValidator(1)], help_text="Price per person, in centavos."
    )
    amenities = models.ManyToManyField(Amenity, blank=True, related_name="tiers")
    position = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["position", "price"]
        constraints = [
            models.UniqueConstraint(fields=["package", "name"], name="catalog_tier_unique_name"),
        ]

    def __str__(self):
        return f"{self.package} · {self.name}"


class ItineraryStop(models.Model):
    tier = models.ForeignKey(Tier, on_delete=models.CASCADE, related_name="itinerary")
    day = models.PositiveSmallIntegerField(validators=[MinValueValidator(1)])
    position = models.PositiveSmallIntegerField(default=0)
    title = models.CharField(max_length=150)
    location = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)

    class Meta:
        ordering = ["day", "position", "start_time"]

    def __str__(self):
        return f"Day {self.day}: {self.title}"
