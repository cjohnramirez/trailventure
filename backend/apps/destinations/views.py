from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from apps.destinations.serializers import *
from apps.destinations.models import *
from apps.properties.models import *
from apps.users.permissions import IsAdministrator


# GUEST (Public Views)
class CountryListView(generics.ListAPIView):
    serializer_class = CountrySerializer
    permission_classes = [AllowAny]


class ProvinceListView(generics.ListAPIView):
    serializer_class = ProvinceSerializer
    permission_classes = [AllowAny]
  
    def get_queryset(self):
        country_id = self.kwargs.get('country_id') 
        if country_id:
            return Province.objects.filter(country=country_id)
        return Province.objects.all() 

class CityListView(generics.ListAPIView):
    serializer_class = CitySerializer
    permission_classes = [AllowAny]
    queryset = City.objects.all()

    def get_queryset(self):
        province_id = self.kwargs.get('province_id') 
        if province_id:
            return City.objects.filter(province=province_id)
        return City.objects.all() 



class AdminDestinationListCreateView(generics.ListCreateAPIView):
    serializer_class = DestinationSerializer
    permission_classes = [IsAdministrator]
    queryset = Destination.objects.all()


class AdminDestinationModifyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DestinationSerializer
    permission_classes = [IsAdministrator]
    queryset = Destination.objects.all()



