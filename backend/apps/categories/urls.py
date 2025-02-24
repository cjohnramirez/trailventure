from django.urls import path
from . import views

urlpatterns = [
  path("destination-type/list/", views.DestinationTypeListView.as_view()),
  path("property-type/list/", views.PropertyTypeListView.as_view()),
  path("property-type/list/", views.PropertyAmenityTypeListView.as_view()),

  path("destination-type/list-create/", views.AdminDestinationTypeListCreateView.as_view()),
  path("destination-type/modify/<int:pk>/", views.AdminDestinationTypeModifyView.as_view()),
  path("property-type/list-create/", views.AdminPropertyTypeListCreateView.as_view()),
  path("property-type/modify/<int:pk>/", views.AdminPropertyTypeModifyView.as_view()),
  path("property-type/list-create/", views.AdminPropertyAmenityTypeListCreateView.as_view()),
  path("property-type/modify/<int:pk>/", views.AdminPropertyAmenityTypeModifyView.as_view()),
]
