"""Image storage: Cloudinary when configured, otherwise static files served by Django.

Catalog models store an image *key*:
- a Cloudinary public ID (e.g. ``trailventure/catalog/destinations/siargao``), or
- a site-relative path (e.g. ``/static/catalog/seed/destinations/siargao.webp``).

The API returns an absolute Cloudinary delivery URL or the path as-is; the web app adds
Cloudinary transformations (format, quality, width) when it renders the image.
"""

from pathlib import Path

import cloudinary
import cloudinary.uploader
from django.conf import settings


def cloudinary_enabled() -> bool:
    return bool(settings.CLOUDINARY_URL)


def image_url(key: str) -> str:
    if not key or key.startswith(("/", "http://", "https://")):
        return key
    cloud_name = cloudinary.config().cloud_name
    return f"https://res.cloudinary.com/{cloud_name}/image/upload/{key}"


def upload_image(file: Path, public_id: str) -> str:
    """Upload a local image to Cloudinary (idempotent: an existing public ID is kept)."""
    result = cloudinary.uploader.upload(
        str(file),
        public_id=public_id,
        overwrite=False,
        unique_filename=False,
        resource_type="image",
    )
    return result["public_id"]
