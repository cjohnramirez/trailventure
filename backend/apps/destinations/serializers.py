from rest_framework import serializers
from apps.destinations.models import *

class DestinationSerializer(serializers.ModelSerializer):
  class Meta:
    model = Destination
    fields = ["name", "description", "image", "location", "country"]
