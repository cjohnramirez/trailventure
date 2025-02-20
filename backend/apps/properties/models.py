from django.db import models
from django.contrib.auth.models import User

class Properties(models.Model):
  name = models.CharField(max_length=255, unique=True, blank=False, null=False)
  description = models.TextField(blank=True, null=False)
  user = models.OneToOneField(
    User, 
    on_delete=models.CASCADE
  )
  address = models.TextField(blank=True, null=False)
  latitude = models.CharField(max_length=50, unique=False, blank=False, null=False)
  longtitude = models.CharField(max_length=50, unique=False, blank=False, null=False)
  bedroom_count = models.PositiveIntegerField(blank=False, null=False)
  bed_count = models.PositiveIntegerField(blank=False, null=False)
  bathroom_count = models.PositiveIntegerField(blank=False, null=False)
  start_date = models.DateField()
  end_date = models.DateField()
  price = models.IntegerField(blank=False, null=False)

  minimum_stay = models.PositiveIntegerField(blank=False)
  
  def __str__(self):
    return f"Property: {self.name}"