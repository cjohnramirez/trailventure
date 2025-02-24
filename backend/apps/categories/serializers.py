from rest_framework import serializers
from apps.categories.models import *

class PropertyTypeSerializer(serializers.ModelSerializer):
  class Meta:
    model = PropertyType
    fields = "__all__"

class DestinationTypeSerializer(serializers.ModelSerializer):
  class Meta:
    model = DestinationType
    fields = "__all__"

class PropertyAmenityTypeSerializer(serializers.ModelSerializer):
  class Meta:
    model = PropertyAmenityType
    fields = "__all__"

