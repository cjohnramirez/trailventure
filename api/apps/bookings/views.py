from django.conf import settings
from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from apps.catalog.models import PackageImage
from apps.core.cron import check_cron_key
from apps.payments.serializers import CheckoutRequestSerializer
from apps.payments.services import create_checkout_session

from . import services
from .models import Booking
from .serializers import (
    BookingCreateSerializer,
    BookingSerializer,
    CheckoutSerializer,
    QuoteRequestSerializer,
    QuoteSerializer,
)


def _bookings_for(user):
    cover = Prefetch("package__images", queryset=PackageImage.objects.order_by("position", "id"))
    return (
        Booking.objects.filter(user=user)
        .select_related("package", "tier", "review")
        .prefetch_related(cover)
    )


@extend_schema(request=QuoteRequestSerializer, responses=QuoteSerializer)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def quote(request):
    """Price a tier for a number of travelers. The client never calculates totals."""
    payload = QuoteRequestSerializer(data=request.data)
    payload.is_valid(raise_exception=True)
    tier = payload.validated_data["tier"]
    if start_date := payload.validated_data.get("start_date"):
        services.validate_start_date(package=tier.package, start_date=start_date)
    result = services.build_quote(tier=tier, guests=payload.validated_data["guests"])
    return Response(QuoteSerializer(result.as_dict()).data)


@extend_schema(request=BookingCreateSerializer, responses=BookingSerializer)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_booking(request):
    payload = BookingCreateSerializer(data=request.data)
    payload.is_valid(raise_exception=True)
    booking = services.create_booking(user=request.user, **payload.validated_data)
    return Response(BookingSerializer(booking).data, status=201)


@extend_schema(responses=BookingSerializer)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def booking_detail(request, booking_id):
    booking = get_object_or_404(_bookings_for(request.user), pk=booking_id)
    return Response(BookingSerializer(booking).data)


@extend_schema(responses=BookingSerializer(many=True))
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def booking_list(request):
    return Response(BookingSerializer(_bookings_for(request.user), many=True).data)


@extend_schema(request=CheckoutRequestSerializer, responses=CheckoutSerializer)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def checkout(request, booking_id):
    """Start Stripe Checkout for a booking and return the URL to redirect to."""
    booking = get_object_or_404(
        Booking.objects.select_related("package", "tier", "user"), pk=booking_id
    )
    if booking.user_id != request.user.id:
        raise PermissionDenied("This booking belongs to someone else.")

    session = create_checkout_session(
        booking=booking,
        success_url=f"{settings.FRONTEND_URL}/booking/success/{booking.id}",
        cancel_url=f"{settings.FRONTEND_URL}/booking/cancelled/{booking.id}",
    )
    return Response(CheckoutSerializer({"checkout_url": session.url}).data)


class ExpiredHoldsSerializer(serializers.Serializer):
    expired = serializers.IntegerField()


@extend_schema(request=None, responses=ExpiredHoldsSerializer, operation_id="bookings_expire_holds")
@api_view(["POST"])
@permission_classes([AllowAny])
def expire_holds(request):
    """Release bookings whose hold ran out, for deployments without a Celery beat process."""
    check_cron_key(request)
    return Response(ExpiredHoldsSerializer({"expired": services.expire_stale_holds()}).data)
