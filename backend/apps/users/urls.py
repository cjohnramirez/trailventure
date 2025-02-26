from django.urls import path
from . import views

urlpatterns = [
  path("profile/<int:pk>", views.UserProfileCreate.as_view(), name="user-profile")
]

