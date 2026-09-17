from allauth.account.models import EmailAddress
from drf_spectacular.utils import extend_schema
from rest_framework import serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import User


class MeUserSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(read_only=True)
    email_verified = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "display_name",
            "role",
            "email_verified",
        ]
        read_only_fields = fields

    def get_email_verified(self, user: User) -> bool:
        return EmailAddress.objects.filter(
            user=user, email__iexact=user.email, verified=True
        ).exists()


class MeSerializer(serializers.Serializer):
    user = MeUserSerializer(allow_null=True)


@extend_schema(responses=MeSerializer)
@api_view(["GET"])
@permission_classes([AllowAny])
def me(request):
    """The signed-in user, or `{"user": null}`.

    Always 200 so that anonymous page loads don't produce 401 responses; allauth's session
    endpoint is used for the auth flows themselves.
    """
    user = request.user if request.user.is_authenticated else None
    return Response(MeSerializer({"user": user}).data)
