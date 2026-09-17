"""Versioned caching for public catalog reads.

Every cache key embeds a catalog version number. Any write to a catalog model bumps the version
(see signals.py), so all cached catalog responses become unreachable at once and simply expire.
"""

import hashlib
import json
from collections.abc import Callable
from typing import Any

from django.core.cache import cache

VERSION_KEY = "catalog:version"
TIMEOUT = 60 * 10


def current_version() -> int:
    version = cache.get(VERSION_KEY)
    if version is None:
        cache.add(VERSION_KEY, 1, timeout=None)
        version = cache.get(VERSION_KEY, 1)
    return int(version)


def bump_version() -> None:
    try:
        cache.incr(VERSION_KEY)
    except ValueError:
        cache.set(VERSION_KEY, 2, timeout=None)


def cached(name: str, params: dict[str, Any], compute: Callable[[], Any]) -> Any:
    digest = hashlib.sha256(json.dumps(params, sort_keys=True, default=str).encode()).hexdigest()[
        :24
    ]
    key = f"catalog:v{current_version()}:{name}:{digest}"
    value = cache.get(key)
    if value is None:
        value = compute()
        cache.set(key, value, timeout=TIMEOUT)
    return value
