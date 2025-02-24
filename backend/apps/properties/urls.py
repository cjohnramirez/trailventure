from django.urls import path
from . import views

urlpatterns = [
  path("list/", views.PropertyListView.as_view()),
  path("create/", views.PropertyCreateView.as_view()),
  path("modify/<int:pk>/", views.PropertyModifyView.as_view()),
  
  path("review/list/<int:pk>/", views.PropertyCreateView.as_view()),
  path("review/create/", views.PropertyReviewCreateView.as_view()),
  path("review/modify/<int:pk>/", views.PropertyReviewModifyView.as_view()),
  path("image/list/<int:pk>/", views.PropertyImageListView.as_view()),
  path("image/create/", views.PropertyImageCreateView.as_view()),
  path("image/modify/<int:pk>/", views.PropertyImageModifyView.as_view()),
]
