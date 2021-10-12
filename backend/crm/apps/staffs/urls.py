from rest_framework.routers import DefaultRouter

from apps.staffs import views

router = DefaultRouter()
router.register('', views.StaffViewSet, basename='staffs')

urlpatterns = router.urls
