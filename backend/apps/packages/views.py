from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from apps.packages.serializers import *
from apps.packages.models import *
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser, FormParser


class PackageListView(generics.ListAPIView):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    permission_classes = [AllowAny]


class PackageCreateView(generics.CreateAPIView):
    serializer_class = PackageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PackageModifyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PackageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Package.objects.filter(user=self.request.user)


class PackageTypeListView(generics.ListAPIView):
    queryset = PackageType.objects.all()
    serializer_class = PackageTypeSerializer
    permission_classes = [AllowAny]


class PackageTypeCreateView(generics.CreateAPIView):
    serializer_class = PackageTypeSerializer
    permission_classes = [IsAuthenticated]


class PackageTypeModifyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PackageTypeSerializer
    permission_classes = [IsAuthenticated]


class PackageAmenityListView(generics.ListAPIView):
    queryset = PackageAmenity.objects.all()
    serializer_class = PackageAmenitySerializer
    permission_classes = [AllowAny]


class PackageAmenityCreateView(generics.CreateAPIView):
    serializer_class = PackageAmenitySerializer
    permission_classes = [IsAuthenticated]


class PackageAmenityModifyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PackageAmenitySerializer
    permission_classes = [IsAuthenticated]


class PackageImageListView(generics.ListAPIView):
    serializer_class = PackageImageSerializer
    permission_classes = [AllowAny]
    queryset = PackageImage.objects.all()
    parser_classes = (MultiPartParser, FormParser)


class PackageImageCreateView(generics.CreateAPIView):
    serializer_class = PackageImageSerializer
    permission_classes = [IsAuthenticated]
    queryset = PackageImage.objects.all()
    parser_classes = (MultiPartParser, FormParser)


class PackageImageModifyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PackageImageSerializer
    permission_classes = [IsAuthenticated]
    queryset = PackageImage.objects.all()
    parser_classes = (MultiPartParser, FormParser)
