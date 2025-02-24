from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()
from apps.categories.models import DestinationType

class Destination(models.Model):
    name = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=False, null=False)
    image = models.ImageField(upload_to="destination_images/")
    added_by_user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    destination_type = models.ForeignKey(
        DestinationType, on_delete=models.CASCADE, null=True, related_name="destinations"
    )
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)


class Country(models.Model):
    name = models.CharField(max_length=255, blank=True, unique=True)
    description = models.TextField(blank=False, null=False)
    image = models.ImageField(upload_to="country_images/", blank=True, null=True)

    def __str__(self):
        return self.name


class Province(models.Model):
    name = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=False, null=False)
    image = models.ImageField(upload_to="province_images/", blank=True, null=True)
    country = models.ForeignKey(
        Country, on_delete=models.CASCADE, null=True, related_name="provinces"
    )

    def __str__(self):
        return f"{self.name}, {self.country.name if self.country else 'Unknown Country'}"



class City(models.Model):
    name = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=False, null=False)
    image = models.ImageField(upload_to="city_images/", blank=True, null=True)
    province = models.ForeignKey(
        Province, on_delete=models.CASCADE, null=True, related_name="cities"
    )

    def __str__(self):
        return f"{self.name}, {self.province.name if self.province else 'Unknown Province'}"

