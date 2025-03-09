import stripe
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from apps.users.permissions import IsCustomer
from apps.packages.models import PackageImage, Package
from apps.transactions.models import Booking, Transaction
from apps.transactions.serializers import *
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from stripe.error import StripeError
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.conf import settings

# USER
@api_view(["POST"])
def checkout_session_view(request, pk):
    try:
        stripe.api_key = settings.STRIPE_SECRET_KEY

        booking = get_object_or_404(Booking, pk=pk, user=request.user)
        package = booking.package_type.package
        package_image = PackageImage.objects.filter(package=package).first()

        YOUR_DOMAIN = "http://localhost:5173/"  # change this in production
        package_image = PackageImage.objects.filter(package=package).first()
        image_url = package_image.image if package_image and package_image.image else ""

        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": booking.currency.lower(),
                        "unit_amount": int(booking.package_type.price_per_person * 100),
                        "product_data": {
                            "name": str(booking.package_type),
                            "images": [image_url] if image_url else [],
                        },
                    },
                    "quantity": booking.num_of_person,
                }
            ],
            metadata={
                "booking_id": str(booking.id),
            },
            mode="payment",
            customer_email=request.user.email,
            success_url=f"{YOUR_DOMAIN}booking/success",
            cancel_url=f"{YOUR_DOMAIN}booking/cancelled",
        )

        return Response({"url": checkout_session.url}, status=status.HTTP_201_CREATED)
    except StripeError as e:
        return Response(
            {"error": f"Stripe error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def stripe_webhook(request):
    stripe.api_key = settings.STRIPE_SECRET_KEY
    payload = request.body
    
    # First check if the header exists
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    if not sig_header:
        print("Stripe signature header missing")
        return HttpResponse(status=401)
        
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        print(f"Invalid payload: {str(e)}")
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        print(f"Invalid signature: {str(e)}")
        return HttpResponse(status=400)
    
    # Handle the event
    if event['type'] == 'checkout.session.completed' or event['type'] == 'checkout.session.async_payment_succeeded':  
        print("Created Stripe session:", event['data']['object'])
        process_transaction(event['data']['object']['id'])
        
    # Return a success response
    return HttpResponse(status=200)

def process_transaction(session_id):
    checkout_session = stripe.checkout.Session.retrieve(
        session_id,
    )

    try:
        payment_id = checkout_session.id
        amount_total = checkout_session.amount_total / 100 
        currency = checkout_session.currency.upper()
        status = 'completed' if checkout_session.payment_status == 'paid' else 'failed'
        booking_id = checkout_session.metadata["booking_id"]

        booking = Booking.objects.filter(id=booking_id).first() if booking_id else None

        transaction, created = Transaction.objects.update_or_create(
            payment_id=payment_id,
            defaults={
                'status': status,
                'amount': amount_total,
                'currency': currency,
                'booking': booking,
            }
        )

        if created:
            print(f"Created new transaction: {transaction}")
        else:
            print(f"Updated existing transaction: {transaction}")

    except Exception as e:
        print(f"Error processing transaction: {str(e)}")


class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        package_id = self.request.data.get("Package")
        serializer.save(user=self.request.user)


class BookingModifyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Booking, user=self.request.user, pk=self.kwargs["pk"])


class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)


class TransactionModifyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

class PackageReviewListView(generics.ListAPIView):
    serializer_class = PackageReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        pk = self.kwargs.get('id')
        package_type = PackageType.objects.filter(package=pk)
        booking = Booking.objects.filter(package_type__in=package_type)
        transaction = Transaction.objects.filter(booking__in=booking)
        if self.request.user.is_authenticated:
            package_reviews = PackageReview.objects.filter(transaction__in=transaction).exclude(review_by_user=self.request.user)
        else:
            package_reviews = PackageReview.objects.filter(transaction__in=transaction)
        return package_reviews
    
class OwnPackageReviewListView(generics.ListAPIView):
    serializer_class = PackageReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        pk = self.kwargs.get('id')
        package_type = PackageType.objects.filter(package=pk)
        booking = Booking.objects.filter(package_type__in=package_type, user=self.request.user)
        transaction = Transaction.objects.filter(booking__in=booking)
        own_package_reviews = PackageReview.objects.filter(transaction__in=transaction)
        return own_package_reviews


class PackageReviewCreateView(generics.ListCreateAPIView):
    serializer_class = PackageReviewSerializer
    permission_classes = [IsCustomer]

    def get_queryset(self):
        return PackageReview.objects.filter(review_by_user=self.request.user)

    def perform_create(self, serializer):
        package_id = self.request.data.get("Package")
        if PackageReview.objects.filter(
            review_by_user=self.request.user, package_id=package_id
        ).exists():
            raise ValidationError("You have already reviewed this Package.")
        serializer.save(review_by_user=self.request.user)


class PackageReviewModifyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PackageReviewSerializer
    permission_classes = [IsCustomer]

    def get_queryset(self):
        return PackageReview.objects.filter(review_by_user=self.request.user)


class AdditionalFeesListView(generics.ListAPIView):
    serializer_class = AdditionalFeesSerializer
    permission_classes = [AllowAny]
    queryset = AdditionalFees.objects
