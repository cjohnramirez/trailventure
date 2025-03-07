from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from apps.packages.serializers import *
from apps.users.permissions import IsCustomer, IsHost
from apps.packages.models import *
from rest_framework.parsers import MultiPartParser, FormParser

class PackageSearchView(generics.ListAPIView):
    

class PackageListView(generics.ListAPIView):
    serializer_class = PackageListSerializer
    permission_classes = [AllowAny]
    queryset = Package.objects.all()


class PackageSingleView(generics.ListAPIView):
    serializer_class = PackageSingleSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        pk = self.kwargs.get('pk')
        return Package.objects.filter(id=pk)

class PackageCreateView(generics.CreateAPIView):
    serializer_class = PackageListSerializer
    permission_classes = [IsHost]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PackageModifyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PackageListSerializer
    permission_classes = [IsHost]

    def get_queryset(self):
        return Package.objects.filter(user=self.request.user)


class PackageTypeListView(generics.ListAPIView):
    queryset = PackageType.objects.all()
    serializer_class = PackageTypeListSerializer
    permission_classes = [AllowAny]


class PackageTypeCreateView(generics.CreateAPIView):
    serializer_class = PackageTypeListSerializer
    permission_classes = [IsHost]


class PackageTypeModifyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PackageTypeListSerializer
    permission_classes = [IsHost]


class PackageTypeAmenityListView(generics.ListAPIView):
    queryset = PackageTypeAmenity.objects.all()
    serializer_class = PackageTypeAmenitySerializer
    permission_classes = [AllowAny]


class PackageTypeAmenityCreateView(generics.CreateAPIView):
    serializer_class = PackageTypeAmenitySerializer
    permission_classes = [IsHost]


class PackageTypeAmenityModifyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PackageTypeAmenitySerializer
    permission_classes = [IsHost]


class PackageAmenityListView(generics.ListAPIView):
    queryset = PackageAmenity.objects.all()
    serializer_class = PackageAmenitySerializer
    permission_classes = [AllowAny]


class PackageAmenityCreateView(generics.CreateAPIView):
    serializer_class = PackageAmenitySerializer
    permission_classes = [IsHost]


class PackageAmenityModifyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PackageAmenitySerializer
    permission_classes = [IsHost]


class PackageImageListView(generics.ListAPIView):
    serializer_class = PackageImageSerializer
    permission_classes = [AllowAny]
    queryset = PackageImage.objects.all()
    parser_classes = (MultiPartParser, FormParser)


class PackageImageCreateView(generics.CreateAPIView):
    serializer_class = PackageImageSerializer
    permission_classes = [IsHost]
    queryset = PackageImage.objects.all()
    parser_classes = (MultiPartParser, FormParser)


class PackageImageModifyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PackageImageSerializer
    permission_classes = [IsHost]
    queryset = PackageImage.objects.all()
    parser_classes = (MultiPartParser, FormParser)
