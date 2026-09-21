from django.db.models import QuerySet

from .models import Review


def reviews_for_package(package_id: int) -> QuerySet[Review]:
    return (
        Review.objects.filter(package_id=package_id, is_hidden=False)
        .select_related("user", "user__profile")
        .order_by("-created_at")
    )


def reviews_by_user(user) -> QuerySet[Review]:
    return (
        Review.objects.filter(user=user, is_hidden=False)
        .select_related("package", "user", "user__profile")
        .order_by("-created_at")
    )
