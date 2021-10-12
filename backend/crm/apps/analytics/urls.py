from rest_framework.routers import DefaultRouter

from .views import students, finances


router = DefaultRouter()
router.register(r'students', students.StudentsAnalyticsViewSet, basename='students')
router.register(r'finances', finances.FinancesAnalyticsViewSet, basename='finances')

urlpatterns = []

urlpatterns += router.urls
