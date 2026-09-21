from dataclasses import dataclass
from datetime import date

from django.db.models import Count, Prefetch, Q, QuerySet

from .models import Destination, ItineraryStop, Package, PackageImage, Tier


@dataclass(frozen=True)
class PackageSearch:
    destination: str | None = None
    query: str | None = None
    start: date | None = None
    end: date | None = None
    min_price: int | None = None  # centavos
    max_price: int | None = None  # centavos
    rating: int | None = None


def published_packages() -> QuerySet[Package]:
    return Package.objects.filter(status=Package.Status.PUBLISHED)


def destination_list(*, featured_only: bool = False) -> QuerySet[Destination]:
    destinations = Destination.objects.annotate(
        package_count=Count("packages", filter=Q(packages__status=Package.Status.PUBLISHED))
    )
    if featured_only:
        destinations = destinations.filter(featured_order__isnull=False)
    return destinations.order_by("featured_order", "name")


def package_search(params: PackageSearch) -> QuerySet[Package]:
    packages = published_packages().select_related("destination")

    if params.destination:
        packages = packages.filter(destination__slug=params.destination)
    if params.query:
        packages = packages.filter(
            Q(name__icontains=params.query)
            | Q(destination__name__icontains=params.query)
            | Q(destination__region__icontains=params.query)
        )
    # A trip must be able to start within the requested range.
    if params.start:
        packages = packages.filter(available_until__gte=params.start)
    if params.end:
        packages = packages.filter(available_from__lte=params.end)
    if params.min_price is not None:
        packages = packages.filter(min_price__gte=params.min_price)
    if params.max_price is not None:
        packages = packages.filter(min_price__lte=params.max_price)
    if params.rating:
        packages = packages.filter(rating_avg__gte=params.rating)

    cover = Prefetch("images", queryset=PackageImage.objects.order_by("position", "id"))
    return packages.prefetch_related(cover).order_by("-rating_avg", "name")


def package_detail(slug: str) -> Package | None:
    tiers = Prefetch(
        "tiers",
        queryset=Tier.objects.prefetch_related(
            "amenities",
            Prefetch("itinerary", queryset=ItineraryStop.objects.order_by("day", "position")),
        ).order_by("position", "price"),
    )
    return (
        published_packages()
        .select_related("destination")
        .prefetch_related("amenities", "images", tiers)
        .filter(slug=slug)
        .first()
    )
