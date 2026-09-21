from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from apps.catalog import cache

from . import services
from .models import Review


@receiver(post_save, sender=Review)
@receiver(post_delete, sender=Review)
def keep_package_rating_in_sync(sender, instance, **kwargs):
    """A new or hidden review changes the package's rating, so cached catalog reads must go."""
    services.refresh_package_rating(instance.package_id)
    cache.bump_version()
