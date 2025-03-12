from django.contrib.auth import get_user_model
from rest_framework import generics
User = get_user_model()
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import CustomerProfile
from .serializers import CustomerProfileSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CustomerProfileListView(generics.ListAPIView):
    serializer_class = CustomerProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user:
            return CustomerProfile.objects.filter(user=self.request.user)
        return CustomerProfile.objects.none()

class CustomerProfileModifyView(generics.UpdateAPIView):
    serializer_class = CustomerProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CustomerProfile.objects.filter(user=self.request.user )