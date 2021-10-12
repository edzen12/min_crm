from rest_framework.routers import DefaultRouter

from apps.branches import views


router = DefaultRouter()
router.register('', views.BranchViewSet, basename='branches')


urlpatterns = router.urls
