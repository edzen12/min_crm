from rest_framework import permissions


class ActionAvailable(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        
        if request.method == 'GET' or request.method == 'POST':
            return True
        
        if user.is_authenticated:
            return user.is_administrator or user.is_trainer or user.is_superuser
        return False


class AllowStudentViewExam(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if request.method != 'GET' and user.is_student:
            return False
        return True