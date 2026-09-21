from datetime import timedelta

import pytest
from django.urls import reverse
from django.utils import timezone

from apps.bookings.models import Booking
from apps.catalog.models import Package
from apps.reviews.models import Review


def make_booking(user, tier, *, status=Booking.Status.CONFIRMED, days_ago=1) -> Booking:
    return Booking.objects.create(
        user=user,
        package=tier.package,
        tier=tier,
        status=status,
        start_date=timezone.localdate() - timedelta(days=days_ago),
        guests=2,
        unit_price=tier.price,
        base_amount=tier.price * 2,
        site_fee_amount=0,
        tax_amount=0,
        total_amount=tier.price * 2,
        tax_percent=0,
        site_fee_percent=0,
        hold_expires_at=timezone.now(),
    )


@pytest.fixture
def confirmed_booking(traveler, tier):
    return make_booking(traveler, tier)


def test_review_needs_a_paid_booking(client, traveler, tier):
    booking = make_booking(traveler, tier, status=Booking.Status.PENDING_PAYMENT)
    client.force_login(traveler)

    response = client.post(
        reverse("review-create"),
        {"booking": str(booking.id), "rating": 5, "comment": "Great trip"},
        content_type="application/json",
    )

    assert response.status_code == 400
    assert "Only paid bookings" in str(response.json())
    assert Review.objects.count() == 0


def test_review_waits_until_the_trip_has_started(client, traveler, tier):
    booking = make_booking(traveler, tier, days_ago=-3)
    client.force_login(traveler)

    response = client.post(
        reverse("review-create"),
        {"booking": str(booking.id), "rating": 5},
        content_type="application/json",
    )

    assert response.status_code == 400
    assert "once it has started" in str(response.json())


def test_review_cannot_be_left_on_someone_elses_booking(client, django_user_model, tier, traveler):
    booking = make_booking(traveler, tier)
    stranger = django_user_model.objects.create_user(
        email="stranger@example.com", password="a-long-password"
    )
    client.force_login(stranger)

    response = client.post(
        reverse("review-create"),
        {"booking": str(booking.id), "rating": 1},
        content_type="application/json",
    )

    assert response.status_code == 400
    assert Review.objects.count() == 0


def test_one_review_per_booking(client, traveler, confirmed_booking):
    client.force_login(traveler)
    payload = {"booking": str(confirmed_booking.id), "rating": 5, "comment": "Loved it"}

    first = client.post(reverse("review-create"), payload, content_type="application/json")
    second = client.post(reverse("review-create"), payload, content_type="application/json")

    assert first.status_code == 201
    assert second.status_code == 400
    assert "already reviewed" in str(second.json())


def test_review_updates_the_package_rating(client, traveler, confirmed_booking, package):
    client.force_login(traveler)

    response = client.post(
        reverse("review-create"),
        {"booking": str(confirmed_booking.id), "rating": 4, "comment": "Would go again"},
        content_type="application/json",
    )

    assert response.status_code == 201
    package.refresh_from_db()
    assert package.rating_count == 1
    assert float(package.rating_avg) == 4.0


def test_package_reviews_are_public_and_hide_moderated_ones(
    client, traveler, confirmed_booking, package
):
    review = Review.objects.create(
        booking=confirmed_booking, package=package, user=traveler, rating=5, comment="Perfect"
    )

    listed = client.get(reverse("package-reviews", args=[package.slug]))
    assert listed.status_code == 200
    body = listed.json()
    assert len(body) == 1
    assert body[0]["comment"] == "Perfect"
    assert body[0]["author"]["name"] == traveler.display_name

    review.is_hidden = True
    review.save()
    assert client.get(reverse("package-reviews", args=[package.slug])).json() == []


def test_hiding_a_review_drops_it_from_the_rating(traveler, confirmed_booking, package):
    review = Review.objects.create(
        booking=confirmed_booking, package=package, user=traveler, rating=5
    )
    package.refresh_from_db()
    assert package.rating_count == 1

    review.is_hidden = True
    review.save()

    package.refresh_from_db()
    assert package.rating_count == 0
    assert float(package.rating_avg) == 0


def test_reviews_are_listed_for_unpublished_packages_only_when_published(client, package):
    package.status = Package.Status.DRAFT
    package.save()
    assert client.get(reverse("package-reviews", args=[package.slug])).status_code == 404


def test_booking_says_whether_it_can_be_reviewed(client, traveler, confirmed_booking):
    client.force_login(traveler)

    body = client.get(reverse("booking-list")).json()

    assert body[0]["can_review"] is True
    assert body[0]["review_blocked_because"] is None
