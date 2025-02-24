from rest_framework.permissions import BasePermission

class IsAdministrator(BasePermission):
  def has_permission(self, request, view):
    if (request.user.is_authenticated != False):
      return request.user.is_authenticated or request.user.role == "administrator"