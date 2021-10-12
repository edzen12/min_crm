from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.users import views

router = DefaultRouter()
router.register('', views.UserViewSet, basename='users')

urlpatterns = [
    path('students/', include('apps.students.urls')),
    path('trainers/', include('apps.trainers.urls')),
    path('staff-members/', include('apps.staffs.urls')),
    path('administrators/', include('apps.administrators.urls')),
    path('current-user/', views.current_user, name='current_user'),
]

urlpatterns += router.urls
