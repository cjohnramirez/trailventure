from django.contrib.auth import get_user_model
from rest_framework import generics

User = get_user_model()
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import CustomerProfile
from .serializers import CustomerProfileSerializer

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CustomerProfileListView(generics.ListAPIView):
    serializer_class = CustomerProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        return CustomerProfile.objects.filter(user=self.request.user)

class CustomerProfileModifyView(generics.RetrieveUpdateAPIView):
    serializer_class = CustomerProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        return CustomerProfile.objects.filter(user=self.request.user )