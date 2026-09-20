from rest_framework import serializers

from apps.catalog.models import Tier
from apps.core.images import image_url

from .models import MAX_GUESTS, Booking


class QuoteRequestSerializer(serializers.Serializer):
    tier = serializers.PrimaryKeyRelatedField(queryset=Tier.objects.select_related("package"))
    guests = serializers.IntegerField(min_value=1, max_value=MAX_GUESTS)
    start_date = serializers.DateField(required=False)


class QuoteSerializer(serializers.Serializer):
    """Price breakdown in centavos, exactly as the booking will be charged."""

    unit_price = serializers.IntegerField()
    guests = serializers.IntegerField()
    base_amount = serializers.IntegerField()
    site_fee_amount = serializers.IntegerField()
    tax_amount = serializers.IntegerField()
    total_amount = serializers.IntegerField()
    tax_percent = serializers.DecimalField(max_digits=5, decimal_places=2)
    site_fee_percent = serializers.DecimalField(max_digits=5, decimal_places=2)


class BookingCreateSerializer(serializers.Serializer):
    tier = serializers.PrimaryKeyRelatedField(queryset=Tier.objects.select_related("package"))
    guests = serializers.IntegerField(min_value=1, max_value=MAX_GUESTS)
    start_date = serializers.DateField()


class BookingSerializer(serializers.ModelSerializer):
    package = serializers.SerializerMethodField()
    tier = serializers.SerializerMethodField()
    is_hold_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "status",
            "package",
            "tier",
            "start_date",
            "guests",
            "unit_price",
            "base_amount",
            "site_fee_amount",
            "tax_amount",
            "total_amount",
            "tax_percent",
            "site_fee_percent",
            "hold_expires_at",
            "is_hold_active",
            "confirmed_at",
            "created_at",
        ]
        read_only_fields = fields

    def get_package(self, booking: Booking) -> dict:
        package = booking.package
        cover = package.images.all()[:1]
        return {
            "slug": package.slug,
            "name": package.name,
            "address": package.address,
            "cover": (
                {"url": image_url(cover[0].image), "alt": cover[0].alt_text} if cover else None
            ),
        }

    def get_tier(self, booking: Booking) -> dict:
        return {"id": booking.tier_id, "name": booking.tier.name}


class CheckoutSerializer(serializers.Serializer):
    checkout_url = serializers.URLField()
