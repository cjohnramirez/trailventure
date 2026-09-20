from django.urls import path

from . import views

urlpatterns = [
    path("payments/stripe/webhook/", views.stripe_webhook, name="stripe-webhook"),
]
