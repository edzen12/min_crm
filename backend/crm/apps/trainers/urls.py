from rest_framework.routers import DefaultRouter

from apps.trainers import views

router = DefaultRouter()
router.register('', views.TrainerViewSet, basename='trainers')

urlpatterns = router.urls
