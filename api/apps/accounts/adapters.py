from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

from apps.core.tasks import send_email_message


class AccountAdapter(DefaultAccountAdapter):
    def send_mail(self, template_prefix, email, context):
        """Render allauth's email as usual, but deliver it from a Celery worker.

        Sending through Mailjet can take a second or more; the request that triggered the email
        (signup, password reset) should not wait for it.
        """
        message = self.render_mail(template_prefix, email, context)
        html = next(
            (
                content
                for content, mimetype in getattr(message, "alternatives", [])
                if mimetype == "text/html"
            ),
            None,
        )
        send_email_message.delay(
            subject=message.subject,
            body=message.body,
            from_email=message.from_email,
            to=list(message.to),
            html=html,
        )


class SocialAccountAdapter(DefaultSocialAccountAdapter):
    def populate_user(self, request, sociallogin, data):
        user = super().populate_user(request, sociallogin, data)
        # Google accounts arrive with a verified email; names come from the Google profile.
        user.first_name = user.first_name or data.get("first_name") or ""
        user.last_name = user.last_name or data.get("last_name") or ""
        return user
