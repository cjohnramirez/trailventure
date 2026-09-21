from rest_framework import serializers

from apps.core.images import image_url

from .models import Amenity, Destination, ItineraryStop, Package, Tier


class PhotoSerializer(serializers.Serializer):
    url = serializers.SerializerMethodField()
    alt = serializers.CharField(source="alt_text")
    credit_name = serializers.CharField()
    credit_url = serializers.CharField()

    def get_url(self, photo) -> str:
        return image_url(photo.image)


class DestinationSerializer(serializers.ModelSerializer):
    photo = PhotoSerializer(source="*")
    package_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Destination
        fields = ["slug", "name", "region", "country", "description", "photo", "package_count"]


class DestinationSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = ["slug", "name", "region", "country"]


class PackageImageSerializer(PhotoSerializer):
    pass


class PackageCardSerializer(serializers.ModelSerializer):
    destination = DestinationSummarySerializer()
    cover = serializers.SerializerMethodField()
    rating_avg = serializers.FloatField()

    class Meta:
        model = Package
        fields = [
            "slug",
            "name",
            "description",
            "address",
            "destination",
            "cover",
            "min_price",
            "rating_avg",
            "rating_count",
        ]

    def get_cover(self, package: Package) -> dict | None:
        images = list(package.images.all())
        return PhotoSerializer(images[0]).data if images else None


class ItineraryStopSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItineraryStop
        fields = ["day", "position", "title", "location", "description", "start_time", "end_time"]


class TierSerializer(serializers.ModelSerializer):
    amenities = serializers.SlugRelatedField[Amenity](many=True, read_only=True, slug_field="name")
    itinerary = ItineraryStopSerializer(many=True)

    class Meta:
        model = Tier
        fields = ["id", "name", "description", "price", "amenities", "itinerary"]


class PackageDetailSerializer(serializers.ModelSerializer):
    destination = DestinationSummarySerializer()
    images = PackageImageSerializer(many=True)
    amenities = serializers.SlugRelatedField[Amenity](many=True, read_only=True, slug_field="name")
    tiers = TierSerializer(many=True)
    rating_avg = serializers.FloatField()

    class Meta:
        model = Package
        fields = [
            "slug",
            "name",
            "description",
            "address",
            "destination",
            "images",
            "amenities",
            "tiers",
            "min_price",
            "rating_avg",
            "rating_count",
            "available_from",
            "available_until",
        ]


class PackageSearchQuerySerializer(serializers.Serializer):
    """Query parameters for package search. Prices are whole pesos in the URL."""

    destination = serializers.SlugField(required=False)
    q = serializers.CharField(required=False, max_length=100, trim_whitespace=True)
    start = serializers.DateField(required=False)
    end = serializers.DateField(required=False)
    min_price = serializers.IntegerField(required=False, min_value=0, max_value=10_000_000)
    max_price = serializers.IntegerField(required=False, min_value=0, max_value=10_000_000)
    rating = serializers.IntegerField(required=False, min_value=1, max_value=5)
    page = serializers.IntegerField(required=False, min_value=1, default=1)

    def validate(self, attrs):
        start, end = attrs.get("start"), attrs.get("end")
        if start and end and end < start:
            raise serializers.ValidationError(
                {"end": "End date must be on or after the start date."}
            )
        low, high = attrs.get("min_price"), attrs.get("max_price")
        if low is not None and high is not None and high < low:
            raise serializers.ValidationError(
                {"max_price": "Maximum must be at least the minimum."}
            )
        return attrs


class PackagePageSerializer(serializers.Serializer):
    count = serializers.IntegerField()
    page = serializers.IntegerField()
    page_size = serializers.IntegerField()
    total_pages = serializers.IntegerField()
    results = PackageCardSerializer(many=True)
