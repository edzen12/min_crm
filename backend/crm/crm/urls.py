from django.contrib import admin
from django.conf.urls.static import static
from django.urls import path, include
from django.conf import settings

from rest_framework import permissions

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from .views import api_root

schema_view = get_schema_view(
    openapi.Info(
        title="IT CRM API",
        default_version='v1',
        description="API for CRM OF IT LICEYUMS",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="akmtvchyngyz@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

api_patterns = [
    path('', api_root, name='api-root'),
    path('branches/', include('apps.branches.urls')),
    path('courses/', include('apps.courses.urls')),
    path('users/', include('apps.users.urls')),
    path('examinations/', include('apps.exams.urls')),
    path('finances/', include('apps.finances.urls')),
    path('schedules/', include('apps.schedules.urls')),
    path('klasses/', include('apps.klasses.urls')),
    path('clients/', include('apps.clients.urls')),
    path('inventories/', include('apps.inventories.urls')),
    path('analytics/', include('apps.analytics.urls')),
    path('news/', include('apps.news.urls')),

    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]

urlpatterns = [
    path('jet/', include('jet.urls', 'jet')),
    path('admin/', admin.site.urls),
    path('api/', include(api_patterns)),
    path('auth/', include('rest_framework.urls')),

    # auth
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
