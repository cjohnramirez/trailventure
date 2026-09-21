from django.urls import path

from . import views

urlpatterns = [
    path("me/", views.me, name="me"),
    path("account/", views.account, name="account"),
    path("account/photo/", views.photo, name="account-photo"),
    path(
        "account/photo/signature/",
        views.photo_upload_signature,
        name="account-photo-signature",
    ),
    path("capabilities/", views.capabilities, name="capabilities"),
]
