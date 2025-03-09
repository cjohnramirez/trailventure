from django.urls import path
from . import views

urlpatterns = [
  path("booking/list-create", views.BookingListCreateView.as_view()),
  path("booking/modify", views.BookingModifyView.as_view()),
  path("transaction/list-create", views.TransactionListCreateView.as_view()),
  path("transaction/modify", views.TransactionModifyView.as_view()),
  path("checkout/session/<int:pk>/", views.checkout_session_view),
  path("checkout/session/hook/", views.stripe_webhook, name='stripe-webhook'),
  path("own-review/list/<int:id>/", views.OwnPackageReviewListView.as_view()),
  path("review/list/<int:id>/", views.PackageReviewListView.as_view()),
  path("review/create", views.PackageReviewCreateView.as_view()),
  path("review/modify", views.PackageReviewModifyView.as_view()),
  path("additional-fees/list", views.AdditionalFeesListView.as_view())
]
