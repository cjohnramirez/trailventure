import logging

from celery import shared_task

from . import services

logger = logging.getLogger(__name__)


@shared_task
def expire_stale_holds() -> int:
    """Backstop for Stripe's expiry webhook: release bookings whose hold ran out."""
    expired = services.expire_stale_holds()
    if expired:
        logger.info("Expired %d stale booking hold(s)", expired)
    return expired
