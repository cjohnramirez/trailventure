from rest_framework import serializers
from apps.packages.models import *
from apps.destinations.serializers import DestinationSerializer


class PackageImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageImage
        fields = ["image"]


class PackageTypeAmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageTypeAmenity
        fields = ["name"]


class PackageTypeListSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageType
        fields = ["id", "name", "price_per_person", "description", "package_type_amenity"]


class PackageRoutePointSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageRoutePoint
        fields = [
            "title",
            "point_number",
            "location",
            "description",
            "day",
            "start_time",
            "end_time",
        ]


class PackageTypeSingleSerializer(serializers.ModelSerializer):
    package_type_amenity = PackageTypeAmenitySerializer(read_only=True, many=True)
    package_route_point = PackageRoutePointSerializer(many=True)

    class Meta:
        model = PackageType
        fields = [
            "id",
            "name",
            "price_per_person",
            "description",
            "package_type_amenity",
            "package_route_point",
        ]

    def get_package_route_point(self, obj):
        package_route_points = obj.package_route_point.all().order_by("point_number")
        return PackageRoutePointSerializer(package_route_points, many=True).data


class PackageListSerializer(serializers.ModelSerializer):
    package_image = PackageImageSerializer(many=True, read_only=True)
    package_type = serializers.SerializerMethodField()
    destination = DestinationSerializer(read_only=True)

    class Meta:
        model = Package
        fields = [
            "id",
            "name",
            "description",
            "destination",
            "address",
            "start_date",
            "end_date",
            "package_image",
            "package_type",
        ]

    def get_package_type(self, obj):
        package_types = obj.package_type.all().order_by("price_per_person")
        return PackageTypeListSerializer(package_types, many=True).data


class PackageAmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageAmenity
        fields = ["name"]


class PackageSingleSerializer(serializers.ModelSerializer):
    package_image = PackageImageSerializer(many=True, read_only=True)
    package_type = serializers.SerializerMethodField()
    destination = DestinationSerializer(read_only=True)
    package_amenity = PackageAmenitySerializer(many=True, read_only=True)

    class Meta:
        model = Package
        fields = [
            "name",
            "description",
            "destination",
            "address",
            "start_date",
            "end_date",
            "package_image",
            "package_type",
            "package_amenity",
        ]

    def get_package_type(self, obj):
        package_types = obj.package_type.all().order_by("price_per_person")
        return PackageTypeSingleSerializer(package_types, many=True).data


