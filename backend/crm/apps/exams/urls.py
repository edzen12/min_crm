from rest_framework.routers import DefaultRouter

from . import views


router = DefaultRouter()
router.register(r'exams', views.ExamAPIViewSet, basename='exams')
router.register(r'user-exams', views.UserExamAPIViewset, basename='user-exams')
router.register(r'questions', views.QuestionView, basename='questions')


urlpatterns = router.urls
