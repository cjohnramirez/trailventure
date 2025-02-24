from django.urls import path
from . import views

urlpatterns = [
  path("booking/list-create", views.BookingListCreateView.as_view()),
  path("booking/modify", views.BookingModifyView.as_view()),
  path("transaction/list-create", views.TransactionListCreateView.as_view()),
  path("transaction/modify", views.TransactionModifyView.as_view()),
  path("checkout/create/<pk>/", views.CreateCheckoutSessionView.as_view()),
  path("currencies/list", views.CurrenciesListView.as_view()),

  path("currencies/modify", views.AdminCurrenciesModifyView.as_view()),
  path("additional-fees/modify", views.AdminAdditionalFeesModifyView.as_view()),
  path("additional-fees/list", views.AdminAdditionalFeesListView.as_view())
]
