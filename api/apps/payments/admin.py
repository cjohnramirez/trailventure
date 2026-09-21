from django.contrib import admin

from .models import Payment, StripeEvent


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("checkout_session_id", "booking", "status", "amount", "created_at")
    list_filter = ("status",)
    search_fields = ("checkout_session_id", "payment_intent_id", "booking__id")
    readonly_fields = [field.name for field in Payment._meta.fields]


@admin.register(StripeEvent)
class StripeEventAdmin(admin.ModelAdmin):
    list_display = ("event_id", "event_type", "received_at", "processed_at")
    search_fields = ("event_id", "event_type")
    readonly_fields = [field.name for field in StripeEvent._meta.fields]
