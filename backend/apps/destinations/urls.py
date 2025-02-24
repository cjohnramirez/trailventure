from django.urls import path
from . import views

urlpatterns = [
  path("country/list/", views.CityListView.as_view()),
  path("province/list/{country_id}/", views.CityListView.as_view()),
  path("city/list/{city_id}/", views.CityListView.as_view()),

  path("list-create/", views.AdminDestinationListCreateView.as_view()),
  path("modify/<int:pk>/", views.AdminDestinationModifyView.as_view()),
]
