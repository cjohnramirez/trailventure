from django.contrib import admin

from .models import Booking, FeeSchedule


@admin.register(FeeSchedule)
class FeeScheduleAdmin(admin.ModelAdmin):
    list_display = ("tax_percent", "site_fee_percent", "is_active", "created_at")


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "package", "status", "start_date", "guests", "total_amount")
    list_filter = ("status",)
    search_fields = ("id", "user__email", "package__name")
    readonly_fields = [field.name for field in Booking._meta.fields]
