import json
from datetime import timedelta
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import ProtectedError
from django.utils import timezone

from apps.bookings.models import FeeSchedule
from apps.catalog.models import Amenity, Destination, ItineraryStop, Package, PackageImage, Tier
from apps.catalog.services import refresh_package_pricing
from apps.core.images import cloudinary_enabled, upload_image

CATALOG_DIR = Path(__file__).resolve().parents[2]
SEED_FILE = CATALOG_DIR / "seed" / "catalog.json"
# Seed photos ship as static files: apps/catalog/static/catalog/seed/<kind>/<name>.webp
SEED_IMAGES = CATALOG_DIR / "static" / "catalog" / "seed"
CLOUDINARY_FOLDER = "trailventure/catalog"
BOOKABLE_DAYS = 365


class Command(BaseCommand):
    help = "Load the demo catalog (destinations, packages, tiers, itineraries). Safe to re-run."

    def add_arguments(self, parser):
        parser.add_argument("--file", type=Path, default=SEED_FILE)

    @transaction.atomic
    def handle(self, *args, file: Path, **options):
        data = json.loads(file.read_text(encoding="utf-8"))
        # The demo is always bookable: trips can start from today for a year.
        available_from = timezone.localdate()
        available_until = available_from + timedelta(days=BOOKABLE_DAYS)

        use_cloudinary = cloudinary_enabled()
        self.stdout.write(
            "Images: uploading to Cloudinary"
            if use_cloudinary
            else "Images: CLOUDINARY_URL not set, using static files"
        )

        fees = data.get("fees")
        if fees:
            FeeSchedule.objects.update_or_create(
                is_active=True,
                defaults={
                    "tax_percent": fees["tax_percent"],
                    "site_fee_percent": fees["site_fee_percent"],
                },
            )

        destinations = {}
        for item in data["destinations"]:
            slug = item["slug"]
            defaults = {k: v for k, v in item.items() if k != "slug"}
            defaults["image"] = self._image_key(item["image"], use_cloudinary)
            destination, _ = Destination.objects.update_or_create(slug=slug, defaults=defaults)
            destinations[slug] = destination

        for item in data["packages"]:
            package, _ = Package.objects.update_or_create(
                slug=item["slug"],
                defaults={
                    "name": item["name"],
                    "destination": destinations[item["destination"]],
                    "description": item["description"],
                    "address": item["address"],
                    "status": Package.Status.PUBLISHED,
                    "available_from": available_from,
                    "available_until": available_until,
                },
            )
            package.amenities.set(self._amenities(item["amenities"]))

            package.images.all().delete()
            PackageImage.objects.bulk_create(
                PackageImage(
                    package=package,
                    **{**image, "image": self._image_key(image["image"], use_cloudinary)},
                )
                for image in item["images"]
            )

            # Tiers are matched by name rather than recreated: bookings reference them, and their
            # price snapshots must survive a re-seed.
            seeded_tiers = []
            for position, tier_item in enumerate(item["tiers"]):
                tier, _ = Tier.objects.update_or_create(
                    package=package,
                    name=tier_item["name"],
                    defaults={
                        "description": tier_item["description"],
                        "price": tier_item["price"],
                        "position": position,
                    },
                )
                seeded_tiers.append(tier.pk)
                tier.amenities.set(self._amenities(tier_item["amenities"]))
                tier.itinerary.all().delete()
                ItineraryStop.objects.bulk_create(
                    ItineraryStop(tier=tier, **stop) for stop in tier_item["itinerary"]
                )
            self._retire_missing_tiers(package, keep=seeded_tiers)
            refresh_package_pricing(package.pk)

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {len(data['destinations'])} destinations "
                f"and {len(data['packages'])} packages."
            )
        )

    def _retire_missing_tiers(self, package: Package, *, keep: list[int]) -> None:
        """Drop tiers the seed no longer lists, unless a booking still points at one."""
        for tier in package.tiers.exclude(pk__in=keep):
            try:
                tier.delete()
            except ProtectedError:
                self.stdout.write(
                    self.style.WARNING(f"Kept booked tier {tier.name} on {package.slug}")
                )

    @staticmethod
    def _image_key(relative_path: str, use_cloudinary: bool) -> str:
        """Upload a seed photo to Cloudinary, or point at its static file."""
        if not use_cloudinary:
            return f"/static/catalog/seed/{relative_path}"
        public_id = f"{CLOUDINARY_FOLDER}/{relative_path.rsplit('.', 1)[0]}"
        return upload_image(SEED_IMAGES / relative_path, public_id)

    @staticmethod
    def _amenities(names: list[str]) -> list[Amenity]:
        return [Amenity.objects.get_or_create(name=name)[0] for name in names]
