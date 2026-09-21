from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from apps.catalog.models import Package

from . import selectors, services
from .serializers import ReviewCreateSerializer, ReviewSerializer

REVIEW_PAGE_SIZE = 20


@extend_schema(responses=ReviewSerializer(many=True), operation_id="reviews_for_package")
@api_view(["GET"])
@permission_classes([AllowAny])
def package_reviews(request, slug):
    package = get_object_or_404(Package.objects.filter(status=Package.Status.PUBLISHED), slug=slug)
    reviews = selectors.reviews_for_package(package.pk)[:REVIEW_PAGE_SIZE]
    return Response(ReviewSerializer(reviews, many=True).data)


@extend_schema(
    request=ReviewCreateSerializer, responses=ReviewSerializer, operation_id="reviews_create"
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_review(request):
    payload = ReviewCreateSerializer(data=request.data)
    payload.is_valid(raise_exception=True)
    review = services.create_review(user=request.user, **payload.validated_data)
    return Response(ReviewSerializer(review).data, status=201)


@extend_schema(responses=ReviewSerializer(many=True), operation_id="reviews_mine")
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_reviews(request):
    return Response(ReviewSerializer(selectors.reviews_by_user(request.user), many=True).data)
