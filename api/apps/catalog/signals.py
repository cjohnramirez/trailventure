from django.db.models.signals import m2m_changed, post_delete, post_save
from django.dispatch import receiver

from . import cache, models, services

CATALOG_MODELS = (
    models.Destination,
    models.Amenity,
    models.Package,
    models.PackageImage,
    models.Tier,
    models.ItineraryStop,
)


@receiver(post_save)
@receiver(post_delete)
def invalidate_catalog_cache(sender, **kwargs):
    if sender in CATALOG_MODELS:
        cache.bump_version()


@receiver(m2m_changed, sender=models.Package.amenities.through)
@receiver(m2m_changed, sender=models.Tier.amenities.through)
def invalidate_catalog_cache_on_m2m(sender, **kwargs):
    cache.bump_version()


@receiver(post_save, sender=models.Tier)
@receiver(post_delete, sender=models.Tier)
def keep_package_min_price_in_sync(sender, instance, **kwargs):
    services.refresh_package_pricing(instance.package_id)
