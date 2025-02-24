from rest_framework import serializers
from apps.transactions.models import *

class AdditionalFeesSerializer(serializers.ModelSerializer):
  class Meta:
    model = AdditionalFees
    fields = "__all__"

class CurrenciesSerializer(serializers.ModelSerializer):
  class Meta:
    model = Currencies
    fields = "__all__"

class TransactionSerializer(serializers.ModelSerializer):
  class Meta:
    model = Transaction
    fields = "__all__"

class BookingSerializer(serializers.ModelSerializer):
  class Meta:
    model = Booking
    fields = "__all__"



