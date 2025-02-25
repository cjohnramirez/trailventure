from django.urls import path
from . import views

urlpatterns = [
  path("list/", views.PackageListView.as_view()),
  path("create/", views.PackageCreateView.as_view()),
  path("modify/<int:pk>/", views.PackageModifyView.as_view()),
  
  path("review/list/<int:pk>/", views.PackageCreateView.as_view()),
  path("image/list/<int:pk>/", views.PackageImageListView.as_view()),
  path("image/create/", views.PackageImageCreateView.as_view()),
  path("image/modify/<int:pk>/", views.PackageImageModifyView.as_view()),

  path("type/list/", views.PackageTypeListView.as_view()),
  path("type/create/", views.PackageTypeCreateView.as_view()),
  path("type/modify/<int:pk>/", views.PackageTypeModifyView.as_view()),

  path("amenity/list/", views.PackageAmenityListView.as_view()),
  path("amenity/create/", views.PackageAmenityCreateView.as_view()),
  path("amenity/modify/<int:pk>/", views.PackageAmenityModifyView.as_view()),
]
