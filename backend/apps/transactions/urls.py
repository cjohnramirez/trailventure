from django.urls import path
from . import views

urlpatterns = [
  path("booking/list-create", views.BookingListCreateView.as_view()),
  path("booking/modify", views.BookingModifyView.as_view()),
  path("transaction/list-create", views.TransactionListCreateView.as_view()),
  path("transaction/modify", views.TransactionModifyView.as_view()),
  path("checkout/create/<pk>/", views.CreateCheckoutSessionView.as_view()),
  path("review/create", views.PackageReviewCreateView.as_view()),
  path("review/modify", views.PackageReviewModifyView.as_view()),
]
