from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from apps.properties.serializers import *
from apps.properties.models import *
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser, FormParser

class PropertyListView(generics.ListAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [AllowAny]

class PropertyCreateView(generics.CreateAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PropertyModifyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Property.objects.filter(user=self.request.user)

    def get_object(self):
        obj = super().get_object()
        if obj.user != self.request.user:
            raise PermissionDenied("You do not have permission to modify this property.")
        return obj

class PropertyListReview(generics.ListAPIView):
    serializer_class = PropertyReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        property_id = self.request.query_params.get('property_id')
        return PropertyReview.objects.filter(property_id=property_id) if property_id else PropertyReview.objects.none()

class PropertyReviewCreateView(generics.ListCreateAPIView):
    serializer_class = PropertyReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PropertyReview.objects.filter(review_by_user=self.request.user)

    def perform_create(self, serializer):
        property_id = self.request.data.get("property")
        if PropertyReview.objects.filter(review_by_user=self.request.user, property_id=property_id).exists():
            raise ValidationError("You have already reviewed this property.")
        serializer.save(review_by_user=self.request.user)

class PropertyReviewModifyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PropertyReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PropertyReview.objects.filter(review_by_user=self.request.user)

class PropertyImageListView(generics.ListAPIView):
    serializer_class = PropertyImageSerializer
    permission_classes = [AllowAny]
    queryset = PropertyImage.objects.all()
    parser_classes = (MultiPartParser, FormParser)

class PropertyImageCreateView(generics.CreateAPIView):
    serializer_class = PropertyImageSerializer
    permission_classes = [IsAuthenticated]
    queryset = PropertyImage.objects.all()
    parser_classes = (MultiPartParser, FormParser)

class PropertyImageModifyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PropertyImageSerializer
    permission_classes = [IsAuthenticated]
    queryset = PropertyImage.objects.all()
    parser_classes = (MultiPartParser, FormParser)


