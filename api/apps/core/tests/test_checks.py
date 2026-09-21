import pytest

from apps.core.checks import from_address_is_deliverable


@pytest.mark.parametrize(
    "address",
    [
        "TrailVenture <no-reply@trailventure.local>",
        "no-reply@example.com",
        "no-reply@trailventure.test",
    ],
)
def test_placeholder_senders_fail_the_deploy_check(settings, address):
    settings.DEFAULT_FROM_EMAIL = address

    errors = from_address_is_deliverable(None)

    assert [error.id for error in errors] == ["core.E001"]


@pytest.mark.parametrize(
    "address",
    ["TrailVenture <no-reply@trailventure.ph>", "someone@gmail.com"],
)
def test_a_real_sender_passes(settings, address):
    settings.DEFAULT_FROM_EMAIL = address

    assert from_address_is_deliverable(None) == []
