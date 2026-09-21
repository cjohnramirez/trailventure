from rest_framework import serializers


class CheckoutRequestSerializer(serializers.Serializer):
    """Checkout takes no body: the booking holds the price and the URLs come from settings."""
