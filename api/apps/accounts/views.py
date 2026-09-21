from allauth.account.models import EmailAddress
from drf_spectacular.utils import extend_schema
from rest_framework import serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from apps.core.images import cloudinary_enabled

from . import services
from .models import User
from .serializers import AccountSerializer


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


class ProfilePhotoKindSerializer(serializers.Serializer):
    kind = serializers.ChoiceField(choices=services.PHOTO_KINDS)


class ProfilePhotoSignatureSerializer(serializers.Serializer):
    public_id = serializers.CharField()
    timestamp = serializers.IntegerField()
    overwrite = serializers.CharField()
    invalidate = serializers.CharField()
    signature = serializers.CharField()
    api_key = serializers.CharField()
    cloud_name = serializers.CharField()
    upload_url = serializers.URLField()


class ProfilePhotoSerializer(serializers.Serializer):
    kind = serializers.ChoiceField(choices=services.PHOTO_KINDS)
    version = serializers.IntegerField(min_value=1)


@extend_schema(
    methods=["GET"], responses=AccountSerializer, operation_id="accounts_account_retrieve"
)
@extend_schema(
    methods=["PATCH"],
    request=AccountSerializer,
    responses=AccountSerializer,
    operation_id="accounts_account_update",
)
@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def account(request):
    """Read or edit the signed-in traveler's own details."""
    if request.method == "PATCH":
        serializer = AccountSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    return Response(AccountSerializer(request.user).data)


@extend_schema(request=ProfilePhotoKindSerializer, responses=ProfilePhotoSignatureSerializer)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def photo_upload_signature(request):
    """Sign a direct browser upload to Cloudinary; the file never passes through this service."""
    payload = ProfilePhotoKindSerializer(data=request.data)
    payload.is_valid(raise_exception=True)
    signature = services.build_upload_signature(
        user=request.user, kind=payload.validated_data["kind"]
    )
    return Response(ProfilePhotoSignatureSerializer(signature).data)


@extend_schema(
    methods=["POST"],
    request=ProfilePhotoSerializer,
    responses=AccountSerializer,
    operation_id="accounts_photo_set",
)
@extend_schema(
    methods=["DELETE"],
    request=ProfilePhotoKindSerializer,
    responses=AccountSerializer,
    operation_id="accounts_photo_clear",
)
@api_view(["POST", "DELETE"])
@permission_classes([IsAuthenticated])
def photo(request):
    """Point the profile at an uploaded photo, or remove the current one."""
    if request.method == "DELETE":
        removal = ProfilePhotoKindSerializer(data=request.data)
        removal.is_valid(raise_exception=True)
        services.clear_profile_photo(user=request.user, kind=removal.validated_data["kind"])
    else:
        upload = ProfilePhotoSerializer(data=request.data)
        upload.is_valid(raise_exception=True)
        services.set_profile_photo(user=request.user, **upload.validated_data)
    request.user.refresh_from_db()
    return Response(AccountSerializer(request.user).data)


class UploadsEnabledSerializer(serializers.Serializer):
    photo_uploads = serializers.BooleanField()


@extend_schema(responses=UploadsEnabledSerializer)
@api_view(["GET"])
@permission_classes([AllowAny])
def capabilities(request):
    """What the account page can offer; photo uploads need Cloudinary to be configured."""
    return Response(UploadsEnabledSerializer({"photo_uploads": cloudinary_enabled()}).data)
