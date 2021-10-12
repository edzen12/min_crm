from rest_framework.routers import DefaultRouter

from apps.administrators import views

router = DefaultRouter()
router.register('', views.AdministratorViewSet, basename='administrators')

urlpatterns = router.urls
