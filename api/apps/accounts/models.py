from typing import ClassVar

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.functions import Lower

from .managers import UserManager


class Role(models.TextChoices):
    TRAVELER = "traveler", "Traveler"
    HOST = "host", "Host"
    ADMIN = "admin", "Admin"


class User(AbstractUser):
    """Email-based user.

    `role` is server-controlled: every signup starts as a traveler, and only server-side services
    (host approval, admin actions) change it. No serializer or form accepts it from a client.
    """

    username = None  # type: ignore[assignment]  # email is the login field
    email = models.EmailField("email address", unique=True)
    role = models.CharField(max_length=16, choices=Role.choices, default=Role.TRAVELER)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects: ClassVar[UserManager] = UserManager()  # type: ignore[assignment]

    class Meta:
        constraints = [
            models.UniqueConstraint(Lower("email"), name="accounts_user_email_ci_unique"),
        ]

    def __str__(self):
        return self.email

    @property
    def display_name(self) -> str:
        return self.first_name or self.email.split("@", 1)[0]
