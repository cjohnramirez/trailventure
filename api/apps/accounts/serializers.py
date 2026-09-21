from allauth.account.models import EmailAddress
from rest_framework import serializers

from apps.core.images import image_url

from .models import Profile, User


class ProfileSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    banner_url = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            "phone",
            "date_of_birth",
            "bio",
            "avatar",
            "banner",
            "avatar_url",
            "banner_url",
            "facebook_url",
            "x_url",
            "instagram_url",
        ]
        # Photo keys are set by the upload endpoints, never chosen by the client.
        read_only_fields = ["avatar", "banner", "avatar_url", "banner_url"]

    def get_avatar_url(self, profile: Profile) -> str:
        return image_url(profile.avatar)

    def get_banner_url(self, profile: Profile) -> str:
        return image_url(profile.banner)


class AccountSerializer(serializers.ModelSerializer):
    """The account page's view of the signed-in user: name, email state and profile."""

    display_name = serializers.CharField(read_only=True)
    email_verified = serializers.SerializerMethodField()
    profile = ProfileSerializer()

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
            "date_joined",
            "profile",
        ]
        read_only_fields = ["id", "email", "display_name", "role", "email_verified", "date_joined"]

    def get_email_verified(self, user: User) -> bool:
        return EmailAddress.objects.filter(
            user=user, email__iexact=user.email, verified=True
        ).exists()

    def update(self, instance: User, validated_data: dict) -> User:
        # `role` and `email` stay server-controlled; only the fields below are writable.
        profile_data = validated_data.pop("profile", {})
        for field in ("first_name", "last_name"):
            if field in validated_data:
                setattr(instance, field, validated_data[field])
        instance.save()

        profile = instance.profile
        for field, value in profile_data.items():
            setattr(profile, field, value)
        profile.save()
        return instance
