from django.core.management.base import BaseCommand

from apps.bookings import services


class Command(BaseCommand):
    help = "Release bookings whose payment hold has run out."

    def handle(self, *args, **options):
        """What Celery beat runs on its own schedule, for deployments driven by an external one."""
        expired = services.expire_stale_holds()
        self.stdout.write(self.style.SUCCESS(f"Expired {expired} stale booking hold(s)."))
