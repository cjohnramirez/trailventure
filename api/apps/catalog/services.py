from django.db.models import Min

from .models import Package, Tier


def refresh_package_pricing(package_id: int) -> None:
    """Recompute the denormalized cheapest tier price used by cards and price filters."""
    cheapest = Tier.objects.filter(package_id=package_id).aggregate(value=Min("price"))["value"]
    Package.objects.filter(pk=package_id).update(min_price=cheapest or 0)
