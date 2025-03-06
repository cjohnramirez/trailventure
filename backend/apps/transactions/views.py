import stripe
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from apps.users.permissions import IsCustomer
from apps.packages.models import PackageImage
from apps.transactions.serializers import *
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from stripe.error import StripeError

# USER
@api_view(['POST'])
def checkout_session_view(request, pk):
    try:
        stripe.api_key = 'sk_test_51QvhbiKODu0UvT2EA22xFbHY02oI26TylA0CiGet0wsOTqV5WUsap7ksWZn0sPbxqLmYsBy4jSYlv2Mw63Ow7dPF00RqgR9F6Z'
        
        booking = get_object_or_404(Booking, pk=pk, user=request.user)
        package = booking.package_type.package
        package_image = PackageImage.objects.filter(package=package).first()

        YOUR_DOMAIN = "http://localhost:5173/"
        package_image = PackageImage.objects.filter(package=package).first()
        image_url = package_image.image if package_image and package_image.image else ""

        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                'price_data': {
                    'currency': booking.currency.lower(),
                    'unit_amount': int(booking.package_type.price_per_person * 100),
                    'product_data': {
                        'name': str(booking.package_type),
                        'images': [image_url] if image_url else [] 
                    }
                },
                'quantity': booking.num_of_person,
            }],
            mode='payment',
            customer_email=request.user.email,
            success_url=f"{YOUR_DOMAIN}booking/success",
            cancel_url=f"{YOUR_DOMAIN}booking/cancelled",
        )

        return Response({'url': checkout_session.url}, status=status.HTTP_201_CREATED)
    except StripeError as e:
        return Response({'error': f"Stripe error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


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

class PackageReviewCreateView(generics.ListCreateAPIView):
    serializer_class = PackageReviewSerializer
    permission_classes = [IsCustomer]

    def get_queryset(self):
        return PackageReview.objects.filter(review_by_user=self.request.user)

    def perform_create(self, serializer):
        package_id = self.request.data.get("Package")
        if PackageReview.objects.filter(review_by_user=self.request.user, package_id=package_id).exists():
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
    queryset = AdditionalFees.objects.all()
