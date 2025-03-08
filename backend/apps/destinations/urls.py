from django.urls import path
from . import views

urlpatterns = [
  path("list/", views.DestinationListView.as_view()),
  path("list/forhome/", views.DestinationForHomeView.as_view()),
]
