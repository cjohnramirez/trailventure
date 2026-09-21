from django.urls import path

from . import views

urlpatterns = [
    path("destinations/", views.destination_list, name="destination-list"),
    path("packages/", views.package_list, name="package-list"),
    path("packages/<slug:slug>/", views.package_detail, name="package-detail"),
]
