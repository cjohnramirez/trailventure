from typing import ClassVar

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.functions import Lower
from django.db.models.signals import post_save
from django.dispatch import receiver

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


class Profile(models.Model):
    """The traveler details the original user page showed, kept off the auth model.

    `avatar` and `banner` are image keys, like the catalog's (see apps.core.images): a Cloudinary
    public ID, or empty while the traveler hasn't uploaded one.
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    phone = models.CharField(max_length=32, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    avatar = models.CharField(max_length=255, blank=True)
    banner = models.CharField(max_length=255, blank=True)
    facebook_url = models.URLField(max_length=300, blank=True)
    x_url = models.URLField(max_length=300, blank=True)
    instagram_url = models.URLField(max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile for {self.user.email}"


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    """Every user has a profile, so the account page never has to handle a missing one."""
    if created:
        Profile.objects.get_or_create(user=instance)
