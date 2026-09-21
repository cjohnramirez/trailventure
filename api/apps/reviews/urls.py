from django.urls import path

from . import views

urlpatterns = [
    path("packages/<slug:slug>/reviews/", views.package_reviews, name="package-reviews"),
    path("reviews/", views.create_review, name="review-create"),
    path("reviews/mine/", views.my_reviews, name="reviews-mine"),
]
