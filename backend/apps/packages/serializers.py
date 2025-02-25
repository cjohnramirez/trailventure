from rest_framework import serializers
from apps.packages.models import *
  
class PackageImageSerializer(serializers.ModelSerializer):
  class Meta:
    model = PackageImage
    fields = "__all__"
  
class PackageSerializer(serializers.ModelSerializer):
  images = PackageImageSerializer(many=True, read_only=True)

  class Meta:
    model = Package
    fields = "__all__"
    read_only_fields = ['id', 'user']

class PackageTypeSerializer(serializers.ModelSerializer):
  class Meta:
    model = PackageType
    fields = "__all__"

class PackageAmenitySerializer(serializers.ModelSerializer):
  class Meta:
    model = PackageAmenity
    fields = "__all__"
