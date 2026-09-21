from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

MIN_RATING = 1
MAX_RATING = 5


class Review(models.Model):
    """One review per booking.

    Tying a review to a booking rather than to a package is what makes it trustworthy: only a
    traveler whose booking was paid for and whose trip has started can leave one, and they can
    only leave it once.
    """

    booking = models.OneToOneField(
        "bookings.Booking", on_delete=models.CASCADE, related_name="review"
    )
    # Denormalized from the booking so package pages read reviews without joining bookings.
    package = models.ForeignKey("catalog.Package", on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews"
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(MIN_RATING), MaxValueValidator(MAX_RATING)]
    )
    comment = models.TextField(max_length=2000, blank=True)
    # Moderation arrives with the admin dashboard in Phase B; hidden reviews never reach the API.
    is_hidden = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["package", "is_hidden", "-created_at"])]

    def __str__(self):
        return f"{self.rating}★ for {self.package_id} by {self.user_id}"
