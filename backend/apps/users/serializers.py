from django.contrib.auth import get_user_model

User = get_user_model()
from rest_framework import serializers
from .models import CustomerProfile, HostProfile, UserProfileLinks
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["role"] = self.user.role
        return data


class UserProfileLinksSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfileLinks
        fields = ["facebook", "twitter", "instagram"]


class UserSerializer(serializers.ModelSerializer):
    user_profile_links = UserProfileLinksSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "password",
            "role",
            "user_profile_links",
        ]

    def validate(self, data):
        required_fields = ["email", "first_name", "last_name", "role"]
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError(
                    {field: f"{field.title().replace('_', ' ')} is required"}
                )
        return data

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)

        if user.role == User.CUSTOMER:
            CustomerProfile.objects.create(user=user)
        elif user.role == User.HOST:
            HostProfile.objects.create(user=user)

        return user


class CustomerProfileForReviewByUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = ["avatar"]


class ReviewByUserSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='username', read_only=True)
    customer_profile = CustomerProfileForReviewByUserSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ["user", "customer_profile"]
1

class HostProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = HostProfile
        fields = "__all__"


class CustomerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = CustomerProfile
        fields = ["user", "date_of_birth", "phone_number", "avatar", "banner"]
