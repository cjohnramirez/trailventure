import pytest
from allauth.account.models import EmailAddress
from django.core.management import call_command
from django.core.management.base import CommandError

from apps.accounts.models import Role, User


@pytest.mark.django_db
def test_seed_demo_users_creates_verified_accounts(settings):
    settings.DEBUG = True

    call_command("seed_demo_users", verbosity=0)
    call_command("seed_demo_users", verbosity=0)  # idempotent

    traveler = User.objects.get(email="traveler@trailventure.local")
    admin = User.objects.get(email="admin@trailventure.local")
    assert traveler.role == Role.TRAVELER and not traveler.is_staff
    assert admin.role == Role.ADMIN and admin.is_superuser
    assert traveler.check_password("trailventure-demo")
    assert EmailAddress.objects.filter(user=traveler, verified=True).exists()


@pytest.mark.django_db
def test_seed_demo_users_refuses_without_debug(settings):
    settings.DEBUG = False

    with pytest.raises(CommandError):
        call_command("seed_demo_users")
