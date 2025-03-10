from rest_framework import generics
from rest_framework.permissions import AllowAny
from apps.packages.serializers import *
from apps.users.permissions import IsHost
from apps.packages.models import *
from django.db.models import Q, Min, Max
from django.utils.dateparse import parse_date
from rest_framework.pagination import PageNumberPagination

class PackagePagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size' 

class PackageSearchView(generics.ListAPIView):
    queryset = Package.objects.all()
    permission_classes = [AllowAny]
    serializer_class = PackageListSerializer
    pagination_class = PackagePagination 

    def get_queryset(self):
        queryset = super().get_queryset()

        destination = self.kwargs.get('destination', None)
        start_date = self.kwargs.get('start_date', None)
        end_date = self.kwargs.get('end_date', None)
        min_price = self.kwargs.get('min_price', None)
        max_price = self.kwargs.get('max_price', None)
        #min_review_score = self.kwargs.get('min_review_score', None)

        if destination and destination != 'None':
            queryset = queryset.filter(destination__name__icontains=destination)

        if start_date != 'None' and end_date != 'None':
            queryset = queryset.filter(
                Q(start_date__gte=parse_date(start_date)) and
                Q(end_date__lte=parse_date(end_date))
            )

        if min_price != 'None' or max_price != 'None':
            queryset = queryset.annotate(
                min_price_per_person=Min('package_type__price_per_person'),
                max_price_per_person=Max('package_type__price_per_person')
            )
            if min_price != 'None':
                queryset = queryset.filter(min_price_per_person__gte=float(min_price))
            if max_price != 'None':
                queryset = queryset.filter(max_price_per_person__lte=float(max_price))

        # if min_review_score != 'None':
        #     queryset = queryset.filter(review_score__gte=float(min_review_score))

        return queryset

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


class PackageImageCreateView(generics.CreateAPIView):
    serializer_class = PackageImageSerializer
    permission_classes = [IsHost]
    queryset = PackageImage.objects.all()


class PackageImageModifyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PackageImageSerializer
    permission_classes = [IsHost]
    queryset = PackageImage.objects.all()
