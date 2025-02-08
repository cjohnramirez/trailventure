from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator, EmailValidator

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    date_of_birth = models.DateField()
    phone_number = models.CharField(
        max_length=15,
        validators=[
          RegexValidator(
            regex=r"^\+?1?\d{9,15}$",
            message="Phone number invalid"
          )
        ]
    )
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} Profile"
