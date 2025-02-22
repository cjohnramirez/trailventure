from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator

class User(AbstractUser):
    ROLE_CHOICES = (
        ("administrator", "Administrator"),
        ("guest", "Guest"),
    )

    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default="guest")

    def __str__(self):
        return self.username

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    date_of_birth = models.DateField()
    phone_number = models.CharField(
        max_length=15,
        validators=[
            RegexValidator(regex=r"^\+?1?\d{9,15}$", message="Phone number invalid")
        ],
    )
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} Profile"
