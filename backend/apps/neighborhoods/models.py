from django.db import models
from django.contrib.auth.models import User

class NeighborhoodType(models.Model):
  name = models.CharField(max_length=255, blank=True, null=True)
