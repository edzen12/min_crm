from rest_framework.routers import DefaultRouter
from apps.klasses.views import KlassAPIViewSet


router = DefaultRouter()
router.register(r'', KlassAPIViewSet, basename='klasses')

urlpatterns = router.urls
