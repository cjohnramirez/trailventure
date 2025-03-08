from rest_framework import generics
from rest_framework.permissions import AllowAny
from apps.destinations.serializers import *
from apps.destinations.models import *
from apps.packages.models import *

class DestinationListView(generics.ListAPIView):
    serializer_class = DestinationSerializer
    permission_classes = [AllowAny]
    queryset = Destination.objects.all()

class DestinationForHomeView(generics.ListAPIView):
    serializer_class = DestinationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Destination.objects.all()[:6]
