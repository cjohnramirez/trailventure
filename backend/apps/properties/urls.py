from django.urls import path
from . import views

urlpatterns = [
  path("property-list/", views.ListPropertyView.as_view()),
  path("property-create/", views.PropertyCreateView.as_view()),
  path("property-modify/<int:pk>", views.PropertyCreateUpdateDestroyView.as_view()),
]
