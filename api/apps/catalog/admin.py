from django.contrib import admin

from .models import Amenity, Destination, ItineraryStop, Package, PackageImage, Tier


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ("name", "region", "country", "featured_order")
    list_editable = ("featured_order",)
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "region", "country")


@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    search_fields = ("name",)


class PackageImageInline(admin.TabularInline):
    model = PackageImage
    extra = 0


class TierInline(admin.StackedInline):
    model = Tier
    extra = 0
    filter_horizontal = ("amenities",)


@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ("name", "destination", "status", "min_price", "rating_avg")
    list_filter = ("status", "destination")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "destination__name")
    filter_horizontal = ("amenities",)
    readonly_fields = ("min_price", "rating_avg", "rating_count")
    inlines = [PackageImageInline, TierInline]


class ItineraryStopInline(admin.TabularInline):
    model = ItineraryStop
    extra = 0


@admin.register(Tier)
class TierAdmin(admin.ModelAdmin):
    list_display = ("name", "package", "price")
    inlines = [ItineraryStopInline]
