from rest_framework.routers import DefaultRouter

from apps.courses import views

router = DefaultRouter()
router.register('coursestags', views.CourseTagAPIViewSet, basename="course_tags")
router.register('', views.CourseViewSet, basename="courses")


urlpatterns = router.urls
