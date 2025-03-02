from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    ADMIN = "admin"
    CUSTOMER = "customer"
    HOST = "host"

    ROLE_CHOICES = [
        (ADMIN, "Admin"),
        (CUSTOMER, "Customer"),
        (HOST, "Host"),
        ("guest", "Guest"),
    ]

    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default="guest")

    def save(self, *args, **kwargs):
        if self.is_superuser and self.role != "administrator":
            self.role = "administrator"
        super().save(*args, **kwargs)

        if self.role == self.CUSTOMER and not hasattr(self, "customer_profile"):
            CustomerProfile.objects.create(user=self)
        elif self.role == self.HOST and not hasattr(self, "host_profile"):
            HostProfile.objects.create(user=self)

    def __str__(self):
        return self.username

class UserProfileLinks(models.Model):
    class Meta:
        verbose_name_plural = "User profile links"

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="user_profile_links")
    facebook = models.URLField(max_length=255, null=True, blank=True)
    twitter = models.URLField(max_length=255, null=True, blank=True)
    instagram = models.URLField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"Links for {self.user.username}"


class CustomerProfile(models.Model):
    GENDER_CHOICES = [
        ("M", "Male"),
        ("F", "Female"),
        ("O", "Other"),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="customer_profile"
    )
    gender = models.CharField(max_length=15, choices=GENDER_CHOICES, null=True)
    date_of_birth = models.DateField(null=True)
    phone_number = models.CharField(max_length=15)
    avatar = models.ImageField(upload_to="users_avatar/", null=True)
    banner = models.ImageField(upload_to="users_banner/", null=True)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Customer {self.user.username} Profile"


class HostProfile(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="host_profile"
    )
    company_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)
    company_logo = models.ImageField(upload_to="company_logo/")
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Host {self.company_name} Profile"
