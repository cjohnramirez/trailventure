"""Account writes. Views stay thin; anything that changes a user goes through here."""

import time

import cloudinary
import cloudinary.utils
from rest_framework.exceptions import ValidationError

from apps.core.images import cloudinary_enabled

from .models import Profile, User

PHOTO_KINDS = ("avatar", "banner")


def photo_public_id(user: User, kind: str) -> str:
    """One deterministic public ID per user and kind, so an upload replaces the previous photo."""
    return f"trailventure/accounts/{kind}s/{user.pk}"


def build_upload_signature(*, user: User, kind: str) -> dict:
    """Parameters for a direct browser upload to Cloudinary.

    The browser uploads the file itself, so image bytes never pass through this service. Only the
    signature is issued here, and it covers a public ID the client cannot change.
    """
    if kind not in PHOTO_KINDS:
        raise ValidationError({"kind": "Choose either an avatar or a banner."})
    if not cloudinary_enabled():
        raise ValidationError({"detail": "Photo uploads are not configured."})

    config = cloudinary.config()
    params = {
        "public_id": photo_public_id(user, kind),
        "timestamp": int(time.time()),
        "overwrite": "true",
        "invalidate": "true",
    }
    signature = cloudinary.utils.api_sign_request(params, config.api_secret)
    return {
        **params,
        "signature": signature,
        "api_key": config.api_key,
        "cloud_name": config.cloud_name,
        "upload_url": f"https://api.cloudinary.com/v1_1/{config.cloud_name}/image/upload",
    }


def set_profile_photo(*, user: User, kind: str, version: int) -> Profile:
    """Point the profile at the photo the browser just uploaded.

    The version from Cloudinary's response goes into the key, so the new photo gets a fresh URL
    instead of a cached copy of the old one.
    """
    if kind not in PHOTO_KINDS:
        raise ValidationError({"kind": "Choose either an avatar or a banner."})

    profile = user.profile
    setattr(profile, kind, f"v{version}/{photo_public_id(user, kind)}")
    profile.save(update_fields=[kind, "updated_at"])
    return profile


def clear_profile_photo(*, user: User, kind: str) -> Profile:
    if kind not in PHOTO_KINDS:
        raise ValidationError({"kind": "Choose either an avatar or a banner."})

    profile = user.profile
    setattr(profile, kind, "")
    profile.save(update_fields=[kind, "updated_at"])
    return profile
