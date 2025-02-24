import stripe
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from apps.transactions.serializers import *
from apps.transactions.models import *
from apps.users.permissions import IsAdministrator
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from django.views import View
from django.http import JsonResponse


# USER
class CreateCheckoutSessionView(View):
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
                            'name': transaction.booking.property.name,
                            'images': [transaction.booking.property.property_image.url]
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
        property_id = self.request.data.get("property")
        try:
            property_id = int(property_id)
        except:
            raise ValidationError("Invalid property ID.")

        if Booking.objects.filter(
            user=self.request.user, property_id=property_id
        ).exists():
            raise ValidationError("You cannot book the same property more than once.")
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


class CurrenciesListView(generics.ListAPIView):
    queryset = Currencies.objects.all()
    serializer_class = CurrenciesSerializer
    permission_classes = [AllowAny]


# ADMIN
class AdminCurrenciesModifyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Currencies.objects.all()
    serializer_class = CurrenciesSerializer
    permission_classes = [IsAdministrator]


class AdminAdditionalFeesListView(generics.ListAPIView):
    queryset = AdditionalFees.objects.all()
    serializer_class = AdditionalFeesSerializer
    permission_classes = [IsAdministrator]


class AdminAdditionalFeesModifyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AdditionalFees.objects.all()
    serializer_class = AdditionalFeesSerializer
    permission_classes = [IsAdministrator]
