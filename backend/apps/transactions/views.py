import stripe
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from apps.users.permissions import IsCustomer
from apps.transactions.serializers import *
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from django.views import View
from django.http import JsonResponse


# USER
class CreateCheckoutSessionView(View):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        transaction_id = self.kwargs["pk"]
        transaction = Transaction.objects.get(id=transaction_id)
        YOUR_DOMAIN = "http://localhost:8000/"
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["paypal", "card", "amazon_pay"],
            line_items=[
                {
                    'price_data': {
                        'currency': transaction.currency.name,
                        'unit_amount': transaction.amount,
                        'product_data': {
                            'name': transaction.booking.Package.name,
                            'images': [transaction.booking.Package.Package_image.url]
                        }
                    }
                },
            ],
            mode='payment',
            success_url=YOUR_DOMAIN + '?success=true',
            cancel_url=YOUR_DOMAIN + '?canceled=true',
        )
        return JsonResponse({
            'id': checkout_session.id
        })



class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        package_id = self.request.data.get("Package")
        try:
            package_id = int(package_id)
        except:
            raise ValidationError("Invalid Package ID.")

        if Booking.objects.filter(
            user=self.request.user, package_id=package_id
        ).exists():
            raise ValidationError("You cannot book the same Package more than once.")
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
