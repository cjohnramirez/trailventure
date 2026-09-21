from rest_framework import serializers

from apps.bookings.models import Booking
from apps.core.images import image_url

from .models import MAX_RATING, MIN_RATING, Review


class ReviewAuthorSerializer(serializers.Serializer):
    name = serializers.CharField()
    avatar_url = serializers.CharField(allow_blank=True)


class ReviewSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ["id", "author", "rating", "comment", "created_at"]
        read_only_fields = fields

    def get_author(self, review: Review) -> dict:
        profile = getattr(review.user, "profile", None)
        return {
            "name": review.user.display_name,
            "avatar_url": image_url(profile.avatar) if profile else "",
        }


class ReviewCreateSerializer(serializers.Serializer):
    booking = serializers.PrimaryKeyRelatedField(queryset=Booking.objects.select_related("package"))
    rating = serializers.IntegerField(min_value=MIN_RATING, max_value=MAX_RATING)
    comment = serializers.CharField(max_length=2000, allow_blank=True, required=False, default="")
