from rest_framework import serializers
from apps.properties.models import *

class PropertyReviewSerializer(serializers.ModelSerializer):
  class Meta:
    model = PropertyReview
    fields = "__all__"
  
class PropertyImageSerializer(serializers.ModelSerializer):
  class Meta:
    model = PropertyImage
    fields = "__all__"
  
class PropertySerializer(serializers.ModelSerializer):
  images = PropertyImageSerializer(many=True, read_only=True)

  class Meta:
    model = Property
    fields = "__all__"
    read_only_fields = ['id', 'user']