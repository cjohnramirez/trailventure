from rest_framework import serializers
from apps.destinations.models import *

class DestinationSerializer(serializers.ModelSerializer):
  class Meta:
    model = Destination
    fields = "__all__"

class CountrySerializer(serializers.ModelSerializer):
  class Meta:
    model = Country
    fields = "__all__"

class ProvinceSerializer(serializers.ModelSerializer):
  class Meta:
    model = Province
    fields = "__all__"

class CitySerializer(serializers.ModelSerializer):
  class Meta:
    model = City
    fields = "__all__"
