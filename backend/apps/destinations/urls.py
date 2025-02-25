from django.urls import path
from . import views

urlpatterns = [
  path("country/list/", views.CityListView.as_view()),
  path("province/list/{country_id}/", views.CityListView.as_view()),
  path("city/list/{city_id}/", views.CityListView.as_view()),
  path("destination-type/list/", views.DestinationTypeListView.as_view()),
  path("destination/list/", views.DestinationListView.as_view()),
]
