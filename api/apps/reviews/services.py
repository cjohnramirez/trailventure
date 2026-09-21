from django.db.models import Avg, Count
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from apps.bookings.models import Booking
from apps.catalog.models import Package

from .models import Review


def review_blocker(booking: Booking) -> str | None:
    """Why this booking can't be reviewed yet, or None when it can.

    The rules match the original's intent but were never enforced there: a review needs a paid
    booking whose trip has started, and each booking gets one review.
    """
    if booking.status != Booking.Status.CONFIRMED:
        return "Only paid bookings can be reviewed."
    if booking.start_date > timezone.localdate():
        return "You can review this trip once it has started."
    # hasattr uses the cached relation when the queryset selected it, so lists stay at one query.
    if hasattr(booking, "review"):
        return "You have already reviewed this trip."
    return None


def can_review(booking: Booking) -> bool:
    return review_blocker(booking) is None


def create_review(*, user, booking: Booking, rating: int, comment: str = "") -> Review:
    if booking.user_id != user.pk:
        raise ValidationError({"booking": "This booking belongs to someone else."})
    if blocker := review_blocker(booking):
        raise ValidationError({"booking": blocker})

    review = Review.objects.create(
        booking=booking,
        package=booking.package,
        user=user,
        rating=rating,
        comment=comment.strip(),
    )
    refresh_package_rating(booking.package_id)
    return review


def refresh_package_rating(package_id: int) -> None:
    """Recompute the denormalized rating used by cards, search filters and JSON-LD."""
    summary = Review.objects.filter(package_id=package_id, is_hidden=False).aggregate(
        average=Avg("rating"), total=Count("id")
    )
    Package.objects.filter(pk=package_id).update(
        rating_avg=round(summary["average"] or 0, 2), rating_count=summary["total"]
    )
