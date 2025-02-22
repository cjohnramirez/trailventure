from rest_framework import serializers
from apps.properties.models import Property, PropertyType

class PropertySerializer(serializers.ModelSerializer):
  class Meta:
    model = Property
    fields = "__all__"
    read_only_fields = ['id', 'user']

  def create(self, data):
    print(data)
    property = Property.objects.create(**data)
    return property
  
class PropertyTypeSerializer(serializers.ModelSerializer):
  class Meta:
    model = PropertyType
    fields = "__all__"

  def create(self, data):
    print(data)
    propertyType = PropertyType.objects.create(**data)
    return propertyType
