import pytest
from django.core.cache import cache


@pytest.fixture(autouse=True)
def _clear_cache():
    # allauth rate limits live in the cache; don't let one test's attempts throttle the next.
    cache.clear()
    yield
    cache.clear()
