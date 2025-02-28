from rest_framework import generics
from rest_framework.permissions import AllowAny
from apps.destinations.serializers import *
from apps.destinations.models import *
from apps.packages.models import *


class CountryListView(generics.ListAPIView):
    serializer_class = CountrySerializer
    permission_classes = [AllowAny]
    queryset = Country.objects.all()


class DestinationTypeListView(generics.ListAPIView):
    serializer_class = DestinationTypeSerializer
    permission_classes = [AllowAny]
    queryset = DestinationType.objects.all()


class DestinationListView(generics.ListAPIView):
    serializer_class = DestinationSerializer
    permission_classes = [AllowAny]
    queryset = Destination.objects.all()


class CityListView(generics.ListAPIView):
    serializer_class = CitySerializer
    permission_classes = [AllowAny]
    queryset = City.objects.all()
