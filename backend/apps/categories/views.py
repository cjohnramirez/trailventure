from rest_framework import generics
from rest_framework.permissions import AllowAny
from apps.categories.serializers import *
from apps.categories.models import *
from apps.properties.models import *
from apps.users.permissions import IsAdministrator

#GUEST
class DestinationTypeListView(generics.ListAPIView):
    serializer_class = DestinationTypeSerializer
    permission_classes = [AllowAny]
    queryset = DestinationType.objects.all()
    

class PropertyTypeListView(generics.ListAPIView):
    serializer_class = PropertyTypeSerializer
    permission_classes = [AllowAny]
    queryset = PropertyType.objects.all()

class PropertyAmenityTypeListView(generics.ListAPIView):
    serializer_class = PropertyAmenityTypeSerializer
    permission_classes = [AllowAny]
    queryset = PropertyAmenityType.objects.all()


# ADMIN (Protected Views)
class AdminPropertyAmenityTypeListCreateView(generics.ListCreateAPIView):
    serializer_class = PropertyAmenityTypeSerializer
    permission_classes = [IsAdministrator]
    queryset = PropertyAmenityType.objects.all()


class AdminPropertyAmenityTypeModifyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PropertyAmenityTypeSerializer
    permission_classes = [IsAdministrator]
    queryset = PropertyAmenityType.objects.all()


class AdminDestinationTypeListCreateView(generics.ListCreateAPIView):
    serializer_class = DestinationTypeSerializer
    permission_classes = [IsAdministrator]
    queryset = DestinationType.objects.all()


class AdminDestinationTypeModifyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DestinationTypeSerializer
    permission_classes = [IsAdministrator]
    queryset = DestinationType.objects.all()


class AdminPropertyTypeListCreateView(generics.ListCreateAPIView):
    serializer_class = PropertyTypeSerializer
    permission_classes = [IsAdministrator]
    queryset = PropertyType.objects.all()


class AdminPropertyTypeModifyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PropertyTypeSerializer
    permission_classes = [IsAdministrator]
    queryset = PropertyType.objects.all()