import logging

import stripe
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from . import services

logger = logging.getLogger(__name__)


@extend_schema(request=None, responses={200: None})
@csrf_exempt
@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def stripe_webhook(request):
    """Stripe's webhook endpoint.

    Bad signatures are rejected, replays are ignored, and unexpected failures return 5xx so Stripe
    retries instead of silently dropping the payment (the original site always returned 200).
    """
    signature = request.headers.get("Stripe-Signature", "")
    try:
        event = services.verify_webhook(request.body, signature)
    except (ValueError, stripe.SignatureVerificationError):
        logger.warning("Rejected Stripe webhook with an invalid signature")
        return HttpResponse("Invalid signature", status=400)

    outcome = services.handle_event(event)
    logger.info("Stripe event %s (%s): %s", event["id"], event["type"], outcome)
    return Response({"received": True, "outcome": outcome})
