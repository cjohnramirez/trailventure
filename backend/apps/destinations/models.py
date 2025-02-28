from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class DestinationType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=255)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Country(models.Model):
    class Meta:
        verbose_name_plural = "countries"

    name = models.CharField(max_length=255, blank=True, unique=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="country_images/", blank=True, null=True)

    def __str__(self):
        return self.name


class City(models.Model):
    class Meta:
        verbose_name_plural = "cities"

    name = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="city_images/", blank=True, null=True)
    country = models.ForeignKey(
        Country, on_delete=models.CASCADE, null=True, related_name="cities"
    )

    def __str__(self):
        return f"City: {self.name}"


class Destination(models.Model):
    name = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="destination_images/")
    destination_type = models.ForeignKey(
        DestinationType,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="destinations",
    )
    country = models.ForeignKey(
        Country, on_delete=models.CASCADE, null=True, related_name="destinations"
    )
    location = models.CharField(max_length=255, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}"
