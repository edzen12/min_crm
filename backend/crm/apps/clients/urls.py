from rest_framework.routers import DefaultRouter
from apps.clients.views import ClientAPIViewSet


router = DefaultRouter()
router.register(r'', ClientAPIViewSet, basename='clients')

urlpatterns = router.urls
