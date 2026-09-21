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


@pytest.mark.parametrize(
    "url,expected",
    [
        ("redis://localhost:6379/0", "redis://localhost:6379/0"),
        ("rediss://host:6379", "rediss://host:6379?ssl_cert_reqs=CERT_REQUIRED"),
        ("rediss://host:6379?db=0", "rediss://host:6379?db=0&ssl_cert_reqs=CERT_REQUIRED"),
        (
            "rediss://host:6379?ssl_cert_reqs=CERT_NONE",
            "rediss://host:6379?ssl_cert_reqs=CERT_NONE",
        ),
    ],
)
def test_celery_is_told_how_to_verify_a_tls_redis_certificate(url, expected):
    """Managed Redis is TLS-only, and Celery refuses such a URL without this parameter."""
    from config.settings.base import _celery_redis_url

    assert _celery_redis_url(url) == expected


@pytest.mark.parametrize(
    "raw,expected",
    [
        ("a.example,b.example", ["a.example", "b.example"]),
        ("a.example, b.example", ["a.example", "b.example"]),
        ("  a.example ,  b.example  ", ["a.example", "b.example"]),
        ("a.example,,b.example", ["a.example", "b.example"]),
    ],
)
def test_host_lists_ignore_the_spaces_people_type_after_commas(monkeypatch, raw, expected):
    """A host with a leading space matches nothing, and Django's error does not say why."""
    from config.settings.base import _hosts

    monkeypatch.setenv("SOME_HOSTS", raw)

    assert _hosts("SOME_HOSTS") == expected


@pytest.mark.parametrize(
    "enabled,client_id,secret,expected",
    [
        (True, "id", "secret", 1),
        (False, "id", "secret", 0),
        (True, "", "secret", 0),
        (True, "id", "", 0),
    ],
)
def test_google_is_offered_only_when_enabled_and_configured(enabled, client_id, secret, expected):
    """GOOGLE_OAUTH_ENABLED=false turns the provider off without discarding its credentials."""
    from config.settings.base import google_provider_apps

    apps_for_provider = google_provider_apps(enabled, client_id, secret)

    assert len(apps_for_provider) == expected
    assert all(app["client_id"] == client_id for app in apps_for_provider)
