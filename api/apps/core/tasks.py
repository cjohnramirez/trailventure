import logging

from celery import shared_task
from django.core.mail import EmailMultiAlternatives

logger = logging.getLogger(__name__)


@shared_task(
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_backoff_max=300,
    max_retries=5,
)
def send_email_message(
    *, subject: str, body: str, from_email: str, to: list[str], html: str | None = None
) -> None:
    message = EmailMultiAlternatives(subject=subject, body=body, from_email=from_email, to=to)
    if html:
        message.attach_alternative(html, "text/html")
    message.send()
    logger.info("Sent email %r to %d recipient(s)", subject, len(to))
