from django.urls import path
from . import views

urlpatterns = [
  path("customer/profile/", views.CustomerProfileListView.as_view(), name="user-profile"),
  path("customer/profile/modify/<int:pk>", views.CustomerProfileListView.as_view(), name="user-profile")
]

