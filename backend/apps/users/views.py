from django.contrib.auth import get_user_model
from rest_framework import generics

User = get_user_model()
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import CustomerProfile, HostProfile
from .serializers import HostProfileSerializer, CustomerProfileSerializer

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserProfileCreate(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        user = self.request.user 

        if user.role == User.CUSTOMER:
            return CustomerProfile.objects.filter(user=user)
        elif user.role == User.HOST:
            return HostProfile.objects.filter(user=user)

        return CustomerProfile.objects.none() 

    def get_serializer_class(self):
        user = self.request.user

        if user.role == User.CUSTOMER:
            return CustomerProfileSerializer
        elif user.role == User.HOST:
            return HostProfileSerializer

        return None 