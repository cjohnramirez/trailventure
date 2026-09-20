from datetime import date, timedelta
from decimal import Decimal

import pytest
from django.contrib.auth import get_user_model
from django.core.cache import cache

from apps.bookings.models import FeeSchedule
from apps.catalog.models import Destination, Package, Tier

User = get_user_model()


@pytest.fixture(autouse=True)
def _clear_cache():
    # allauth rate limits live in the cache; don't let one test's attempts throttle the next.
    cache.clear()
    yield
    cache.clear()


@pytest.fixture
def traveler(db):
    return User.objects.create_user(email="traveler@example.com", password="a-long-password")


@pytest.fixture
def fees(db):
    # The original site's fees: 20% site fee and 12% tax.
    return FeeSchedule.objects.create(
        tax_percent=Decimal("12.00"), site_fee_percent=Decimal("20.00")
    )


@pytest.fixture
def package(db):
    destination = Destination.objects.create(
        name="Siargao",
        slug="siargao",
        region="Surigao del Norte",
        country="Philippines",
        image="/static/catalog/seed/destinations/siargao.webp",
        alt_text="Siargao",
    )
    return Package.objects.create(
        destination=destination,
        name="Siargao Island Surf & Nature Retreat",
        slug="siargao-surf",
        description="Ride Cloud 9.",
        address="General Luna, Siargao",
        available_from=date.today(),
        available_until=date.today() + timedelta(days=180),
    )


@pytest.fixture
def tier(package):
    return Tier.objects.create(package=package, name="Budget Surfers Delight", price=12_000_00)


@pytest.fixture
def start_date():
    return date.today() + timedelta(days=14)
