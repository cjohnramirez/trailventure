from rest_framework import serializers
from apps.packages.models import *
from apps.destinations.serializers import DestinationSerializer


class PackageImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageImage
        fields = "__all__"


class PackageTypeAmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageTypeAmenity
        fields = "__all__"


class PackageTypeSerializer(serializers.ModelSerializer):
    package_type_amenity = PackageTypeAmenitySerializer(read_only=True)

    class Meta:
        model = PackageType
        fields = "__all__"


class PackageSerializer(serializers.ModelSerializer):
    package_image = PackageImageSerializer(many=True, read_only=True)
    package_type = serializers.SerializerMethodField()
    destination = DestinationSerializer(read_only=True)

    class Meta:
        model = Package
        fields = "__all__"

    def get_package_type(self, obj):
        package_types = obj.package_type.all().order_by("price_per_person")
        return PackageTypeSerializer(package_types, many=True).data


class PackageAmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageAmenity
        fields = "__all__"
