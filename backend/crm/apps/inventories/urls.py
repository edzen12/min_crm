from rest_framework.routers import DefaultRouter

from apps.inventories import views


router = DefaultRouter()

router.register('', views.InventoryViewSet, basename='inventories')

urlpatterns = router.urls
