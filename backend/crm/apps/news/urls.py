from rest_framework.routers import DefaultRouter

from apps.news import views

router = DefaultRouter()
router.register('', views.NewsViewSet, basename='news')

urlpatterns = router.urls
