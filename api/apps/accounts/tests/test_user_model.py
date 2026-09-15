import pytest
from django.contrib.auth import get_user_model
from django.db import IntegrityError

User = get_user_model()


@pytest.mark.django_db
def test_create_user_uses_email_and_hashes_password():
    user = User.objects.create_user(email="Traveler@Example.COM", password="a-long-password")

    assert user.email == "traveler@example.com"
    assert user.check_password("a-long-password")
    assert not user.is_staff
    assert not user.is_superuser


@pytest.mark.django_db
def test_email_is_unique_regardless_of_case():
    User.objects.create_user(email="dup@example.com", password="a-long-password")

    with pytest.raises(IntegrityError):
        User.objects.create(email="DUP@example.com")


@pytest.mark.django_db
def test_create_superuser_sets_flags():
    admin = User.objects.create_superuser(email="admin@example.com", password="a-long-password")

    assert admin.is_staff
    assert admin.is_superuser


def test_user_has_no_username_field():
    assert User.USERNAME_FIELD == "email"
    assert not hasattr(User, "username") or User.username is None
