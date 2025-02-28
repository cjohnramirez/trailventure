from django.contrib import admin
from django.urls import path, include
from apps.users.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("admin-auth/", include("rest_framework.urls")),
    path("apps/users/register/", CreateUserView.as_view(), name="register"),
    path("apps/token/", TokenObtainPairView.as_view(), name="access_token"),
    path("apps/token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    path("apps/users/", include("apps.users.urls")),
    path("apps/package/", include("apps.packages.urls")),
    path("apps/transaction/", include("apps.transactions.urls")),
    path("apps/destination/", include("apps.destinations.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)