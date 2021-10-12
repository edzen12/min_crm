from rest_framework import permissions


class IsAdministrator(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        return request.user.is_administrator or request.user.is_superuser

    def has_permission(self, request, view):
        return request.user.is_administrator or request.user.is_superuser


class IsTrainer(permissions.BasePermission):

    def has_permission(self, request, view):
        return request.user.is_trainer


class IsOwnerOrReadOnlyForUser(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user == obj


class IsOwnerOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user == obj.user


class IsFinance(permissions.BasePermission):

    def has_permission(self, request, view):
        return (
                request.user.is_staff_member and
                request.user.staffmember.is_finance
        )
