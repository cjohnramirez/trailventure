from rest_framework import serializers
from apps.transactions.models import *
from apps.users.serializers import ReviewByUserSerializer, CustomerProfileForReviewByUserSerializer

class AdditionalFeesSerializer(serializers.ModelSerializer):
  class Meta:
    model = AdditionalFees
    fields = "__all__"

class TransactionSerializer(serializers.ModelSerializer):
  class Meta:
    model = Transaction
    fields = "__all__"

class BookingSerializer(serializers.ModelSerializer):
  class Meta:
    model = Booking
    fields = "__all__" 
  
class PackageReviewSerializer(serializers.ModelSerializer):
  review_by_user = ReviewByUserSerializer(read_only=True)

  class Meta:
    model = PackageReview
    fields = ["id", "comment", "rating", "created", "modified", "review_by_user", "transaction"]



