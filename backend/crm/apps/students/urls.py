from rest_framework.routers import DefaultRouter

from apps.students import views

router = DefaultRouter()
router.register(
    'student-categories',
    views.StudentCategoryAPIViewSet,
    basename="student_categories"
)
router.register('', views.StudentViewSet, basename='students')


urlpatterns = router.urls
