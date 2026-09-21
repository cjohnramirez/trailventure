from allauth.account.models import EmailAddress
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.accounts.models import Role, User

DEMO_PASSWORD = "trailventure-demo"  # noqa: S105  (local development accounts only)

DEMO_USERS = [
    {
        "email": "traveler@trailventure.local",
        "first_name": "Tala",
        "last_name": "Reyes",
        "role": Role.TRAVELER,
    },
    {
        "email": "admin@trailventure.local",
        "first_name": "Admin",
        "last_name": "User",
        "role": Role.ADMIN,
    },
]


class Command(BaseCommand):
    help = "Create verified demo accounts with a known password (local development only)."

    def add_arguments(self, parser):
        parser.add_argument("--password", default=DEMO_PASSWORD)

    @transaction.atomic
    def handle(self, *args, password: str, **options):
        if not settings.DEBUG:
            raise CommandError("Refusing to create demo accounts with DEBUG off.")

        for data in DEMO_USERS:
            user, created = User.objects.get_or_create(
                email=data["email"],
                defaults={"first_name": data["first_name"], "last_name": data["last_name"]},
            )
            user.role = data["role"]
            user.is_staff = user.is_superuser = data["role"] == Role.ADMIN
            user.set_password(password)
            user.save()
            EmailAddress.objects.update_or_create(
                user=user, email=user.email, defaults={"verified": True, "primary": True}
            )
            self.stdout.write(f"{'Created' if created else 'Updated'} {user.email} ({user.role})")

        self.stdout.write(self.style.SUCCESS(f"Password for all demo accounts: {password}"))
