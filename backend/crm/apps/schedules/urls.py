from rest_framework.routers import DefaultRouter
from apps.schedules.views import ScheduleAPIViewSet


router = DefaultRouter()
router.register(r'', ScheduleAPIViewSet, basename='schedules')

urlpatterns = router.urls
