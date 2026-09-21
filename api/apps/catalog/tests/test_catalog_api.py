from datetime import date, timedelta

import pytest
from django.core.management import call_command
from django.db import connection
from django.test.utils import CaptureQueriesContext
from django.urls import reverse
from rest_framework.test import APIClient

from apps.catalog.models import Destination, Package, Tier


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def seeded(db):
    call_command("seed_catalog", verbosity=0)


def make_package(destination, name, *, prices, status=Package.Status.PUBLISHED, **extra):
    today = date.today()
    package = Package.objects.create(
        destination=destination,
        name=name,
        slug=name.lower().replace(" ", "-"),
        description=f"{name} description",
        address="Somewhere",
        status=status,
        available_from=extra.pop("available_from", today),
        available_until=extra.pop("available_until", today + timedelta(days=30)),
        **extra,
    )
    for index, price in enumerate(prices):
        Tier.objects.create(
            package=package, name=f"Tier {index}", price=price * 100, position=index
        )
    package.refresh_from_db()
    return package


@pytest.fixture
def destination(db):
    return Destination.objects.create(
        name="Siargao",
        slug="siargao",
        region="Surigao del Norte",
        country="Philippines",
        image="/static/catalog/seed/destinations/siargao.webp",
        alt_text="Siargao",
        featured_order=1,
    )


def test_seed_catalog_loads_the_legacy_catalog_and_is_idempotent(seeded):
    call_command("seed_catalog", verbosity=0)

    assert Destination.objects.count() == 9
    assert Package.objects.count() == 8
    assert Tier.objects.count() == 16
    siargao = Package.objects.get(slug="siargao-island-surf-nature-retreat")
    assert siargao.min_price == 12_000_00
    assert siargao.images.count() == 3


def test_featured_destinations_are_ordered_for_the_bento(client, seeded):
    response = client.get(reverse("destination-list"), {"featured": "true"})

    assert response.status_code == 200
    names = [item["name"] for item in response.json()]
    assert names == [
        "Siargao",
        "Banaue",
        "Palawan",
        "Mount Fuji",
        "Chocolate Hills",
        "Louvre Museum",
    ]
    assert response.json()[0]["package_count"] == 1
    assert response.json()[0]["photo"]["credit_name"]


def test_min_price_follows_tier_changes(destination):
    package = make_package(destination, "Surf Camp", prices=[9000, 15000])
    assert package.min_price == 9000_00

    package.tiers.get(price=9000_00).delete()
    package.refresh_from_db()
    assert package.min_price == 15000_00


def test_search_filters_by_destination_price_and_dates(client, destination):
    other = Destination.objects.create(
        name="Banaue",
        slug="banaue",
        region="Ifugao",
        country="Philippines",
        image="/static/catalog/seed/destinations/banaue.webp",
        alt_text="Banaue",
    )
    make_package(destination, "Cheap Surf", prices=[5000])
    make_package(destination, "Luxury Surf", prices=[40000])
    make_package(
        other,
        "Terraces Later",
        prices=[8000],
        available_from=date.today() + timedelta(days=100),
        available_until=date.today() + timedelta(days=130),
    )
    url = reverse("package-list")

    by_destination = client.get(url, {"destination": "siargao"}).json()
    assert {p["name"] for p in by_destination["results"]} == {"Cheap Surf", "Luxury Surf"}

    by_price = client.get(url, {"min_price": 4000, "max_price": 10000}).json()
    assert {p["name"] for p in by_price["results"]} == {"Cheap Surf", "Terraces Later"}

    soon = date.today() + timedelta(days=5)
    by_dates = client.get(
        url, {"start": soon.isoformat(), "end": (soon + timedelta(days=3)).isoformat()}
    ).json()
    assert {p["name"] for p in by_dates["results"]} == {"Cheap Surf", "Luxury Surf"}


def test_search_filters_by_minimum_rating(client, destination):
    make_package(destination, "Loved", prices=[5000], rating_avg=4.6, rating_count=12)
    make_package(destination, "Unrated", prices=[5000])

    response = client.get(reverse("package-list"), {"rating": 4}).json()

    assert [p["name"] for p in response["results"]] == ["Loved"]


def test_search_hides_unpublished_packages(client, destination):
    make_package(destination, "Draft Trip", prices=[5000], status=Package.Status.DRAFT)

    assert client.get(reverse("package-list")).json()["count"] == 0


def test_search_paginates_six_per_page(client, destination):
    for index in range(8):
        make_package(destination, f"Trip {index}", prices=[5000 + index])

    first = client.get(reverse("package-list")).json()
    second = client.get(reverse("package-list"), {"page": 2}).json()

    assert (first["count"], first["total_pages"], len(first["results"])) == (8, 2, 6)
    assert len(second["results"]) == 2


@pytest.mark.parametrize(
    "params",
    [
        {"start": "2026-10-10", "end": "2026-10-01"},
        {"min_price": 9000, "max_price": 100},
        {"rating": 9},
        {"start": "not-a-date"},
    ],
)
def test_search_rejects_invalid_filters(client, db, params):
    response = client.get(reverse("package-list"), params)

    assert response.status_code == 400


def test_package_detail_includes_tiers_itinerary_and_images(client, seeded):
    response = client.get(reverse("package-detail", args=["siargao-island-surf-nature-retreat"]))

    assert response.status_code == 200
    body = response.json()
    assert [tier["name"] for tier in body["tiers"]] == [
        "Budget Surfers Delight",
        "Luxury Beachfront Retreat",
    ]
    assert body["tiers"][0]["itinerary"][0]["title"] == "Cloud 9 Surfing Spot"
    assert body["amenities"]
    assert len(body["images"]) == 3


def test_package_detail_404s_for_unknown_or_unpublished(client, destination):
    make_package(destination, "Hidden", prices=[5000], status=Package.Status.ARCHIVED)

    assert client.get(reverse("package-detail", args=["hidden"])).status_code == 404
    assert client.get(reverse("package-detail", args=["nope"])).status_code == 404


def test_catalog_reads_are_cached_and_invalidated_on_write(client, destination):
    make_package(destination, "Surf Camp", prices=[9000])
    url = reverse("package-list")
    client.get(url)

    with CaptureQueriesContext(connection) as queries:
        cached = client.get(url).json()
    assert len(queries) == 0
    assert cached["results"][0]["min_price"] == 9000_00

    Tier.objects.filter(package__slug="surf-camp").update(price=1)  # bypasses signals
    Tier.objects.get(package__slug="surf-camp").save()  # save() fires invalidation
    assert client.get(url).json()["results"][0]["min_price"] == 1


def test_search_list_uses_a_bounded_number_of_queries(client, seeded):
    with CaptureQueriesContext(connection) as queries:
        response = client.get(reverse("package-list"))

    assert response.status_code == 200
    assert len(queries) <= 4


def test_seed_uses_static_images_without_cloudinary(seeded, client):
    body = client.get(reverse("destination-list"), {"featured": "true"}).json()

    assert body[0]["photo"]["url"] == "/static/catalog/seed/destinations/siargao.webp"


def test_seed_uploads_to_cloudinary_when_configured(db, settings, monkeypatch):
    settings.CLOUDINARY_URL = "cloudinary://key:secret@demo-cloud"
    uploads = []

    def fake_upload(file, public_id):
        assert file.exists(), file
        uploads.append(public_id)
        return public_id

    monkeypatch.setattr("apps.catalog.management.commands.seed_catalog.upload_image", fake_upload)
    call_command("seed_catalog", verbosity=0)

    assert "trailventure/catalog/destinations/siargao" in uploads
    assert len(uploads) == 9 + 24
    siargao = Destination.objects.get(slug="siargao")
    assert siargao.image == "trailventure/catalog/destinations/siargao"


def test_cloudinary_keys_resolve_to_delivery_urls(settings):
    import cloudinary

    from apps.core.images import image_url

    cloudinary.config(cloud_name="demo-cloud")
    assert (
        image_url("trailventure/catalog/destinations/siargao")
        == "https://res.cloudinary.com/demo-cloud/image/upload/trailventure/catalog/destinations/siargao"
    )
    assert image_url("/static/x.webp") == "/static/x.webp"
