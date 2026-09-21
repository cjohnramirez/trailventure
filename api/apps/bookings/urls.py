from django.urls import path

from . import views

urlpatterns = [
    path("bookings/expire-holds/", views.expire_holds, name="booking-expire-holds"),
    path("bookings/quote/", views.quote, name="booking-quote"),
    path("bookings/", views.booking_list, name="booking-list"),
    path("bookings/create/", views.create_booking, name="booking-create"),
    path("bookings/<uuid:booking_id>/", views.booking_detail, name="booking-detail"),
    path("bookings/<uuid:booking_id>/checkout/", views.checkout, name="booking-checkout"),
]
