from rest_framework import serializers
from apps.transactions.models import *
from apps.users.serializers import ReviewByUserSerializer, UserSerializerReduced
from apps.packages.serializers import PackageTypeSingleSerializer

class AdditionalFeesSerializer(serializers.ModelSerializer):
  class Meta:
    model = AdditionalFees
    fields = "__all__"

class BookingSerializer(serializers.ModelSerializer):
  user = UserSerializerReduced(read_only=True)
  package_type = PackageTypeSingleSerializer(read_only=True)

  class Meta:
    model = Booking
    fields = "__all__" 

class TransactionSerializer(serializers.ModelSerializer):
  booking = serializers.SerializerMethodField()

  class Meta:
    model = Transaction
    fields = "__all__"

  def get_booking(self, obj):
    booking = obj.booking
    return {
      "user": booking.user.username,
      "package": booking.package_type.package.name,
      "id": booking.package_type.package.id,
      "booking_id": booking.id,
    }

class BookingCreateSerializer(serializers.ModelSerializer):
  class Meta:
    model = Booking
    fields = "__all__"
  
class PackageReviewSerializer(serializers.ModelSerializer):
  transaction = TransactionSerializer(read_only=True)
  review_by_user = ReviewByUserSerializer(read_only=True)

  class Meta:
    model = PackageReview
    fields = ["id", "comment", "rating", "created", "modified", "review_by_user", "transaction"]




