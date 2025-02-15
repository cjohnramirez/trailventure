from django.urls import path
from . import views

urlpatterns = [
  path("profile/", views.UserProfileCreate.as_view(), name="user-profile")
]