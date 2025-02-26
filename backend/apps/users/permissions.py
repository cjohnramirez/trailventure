from rest_framework.permissions import BasePermission

class IsHost(BasePermission):
  def has_permission(self, request, view):
    if (request.user.is_authenticated != False):
      return request.user.role == "host"
    
class IsCustomer(BasePermission):
  def has_permission(self, request, view):
    if (request.user.is_authenticated != False):
      return request.user.role == "customer"