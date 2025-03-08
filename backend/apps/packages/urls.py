from django.urls import path
from . import views

urlpatterns = [
    path("<int:pk>/", views.PackageSingleView.as_view()),
    path("list/", views.PackageListView.as_view()),
    path("create/", views.PackageCreateView.as_view()),
    path("modify/<int:pk>/", views.PackageModifyView.as_view()),
    path(
        "<str:destination>/<str:start_date>/<str:end_date>/<str:min_price>/<str:max_price>/",
        views.PackageSearchView.as_view(),
        name="package-search",
    ),
    path("review/list/<int:pk>/", views.PackageCreateView.as_view()),
    path("image/list/", views.PackageImageListView.as_view()),
    path("image/create/", views.PackageImageCreateView.as_view()),
    path("image/modify/<int:pk>/", views.PackageImageModifyView.as_view()),
    path("type/list/", views.PackageTypeListView.as_view()),
    path("type/create/", views.PackageTypeCreateView.as_view()),
    path("type/modify/<int:pk>/", views.PackageTypeModifyView.as_view()),
    path("type-amenity/list/", views.PackageTypeAmenityListView.as_view()),
    path("type-amenity/create/", views.PackageTypeAmenityCreateView.as_view()),
    path("type-amenity/modify/<int:pk>/", views.PackageTypeAmenityModifyView.as_view()),
    path("amenity/list/", views.PackageAmenityListView.as_view()),
    path("amenity/create/", views.PackageAmenityCreateView.as_view()),
    path("amenity/modify/<int:pk>/", views.PackageAmenityModifyView.as_view()),
]
