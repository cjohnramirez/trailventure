"""Deploy checks for settings that only bite in production."""

from django.conf import settings
from django.core.checks import Error, Tags, register

# Addresses on these domains are never deliverable; they are placeholders for local development.
PLACEHOLDER_DOMAINS = (".local", ".invalid", ".test", "example.com", "example.org")


def sender_domain(address: str) -> str:
    """The domain of `Name <user@example.com>` or a bare address."""
    return address.rsplit("@", 1)[-1].strip().rstrip(">").lower()


@register(Tags.security, deploy=True)
def from_address_is_deliverable(app_configs, **kwargs):
    """A placeholder sender makes every verification email vanish silently.

    Mailjet only accepts a `From` address on a domain the account has validated, so shipping the
    development default would break signup without any obvious error.
    """
    domain = sender_domain(settings.DEFAULT_FROM_EMAIL)
    if domain.endswith(PLACEHOLDER_DOMAINS):
        return [
            Error(
                f"DEFAULT_FROM_EMAIL uses the placeholder domain '{domain}'.",
                hint=(
                    "Set DEFAULT_FROM_EMAIL to an address on a domain validated with the email "
                    "provider, e.g. 'TrailVenture <no-reply@yourdomain.com>'."
                ),
                id="core.E001",
            )
        ]
    return []
