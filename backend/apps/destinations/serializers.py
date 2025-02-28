from rest_framework import serializers
from apps.destinations.models import *

class DestinationTypeSerializer(serializers.ModelSerializer):
  class Meta:
    model = DestinationType
    fields = "__all__"

class CountrySerializer(serializers.ModelSerializer):
  class Meta:
    model = Country
    fields = "__all__"

class DestinationSerializer(serializers.ModelSerializer):
  country = CountrySerializer(read_only=True)

  class Meta:
    model = Destination
    fields = "__all__"


class CitySerializer(serializers.ModelSerializer):
  class Meta:
    model = City
    fields = "__all__"
