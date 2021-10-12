from django.db.models import F
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from apps.courses.models import Course, CourseTag
from apps.courses.serializers import (
    CourseSerializer,
    CourseTagSerializer,
    CourseListSerializer
)
from utils.filters import CaseInsensitiveOrderingFilter


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    filter_backends = [
        DjangoFilterBackend,
        CaseInsensitiveOrderingFilter,
        filters.SearchFilter,

    ]
    filterset_fields = ['status', 'branch']
    ordering_fields = [
        'title', 'period', 'branch__name',
    ]
    ordering_case_insensitive_fields = [
        'title', 'period', 'branch__name',
    ]
    search_fields = [
        'title', 'period', 'branch__name',
    ]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return CourseListSerializer
        return self.serializer_class

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Course.objects.annotate(branch_name=F('branch__name'))

        return Course.objects.filter(
            branch=self.request.user.branch).annotate(
            branch_name=F('branch__name')
        )


class CourseTagAPIViewSet(viewsets.ModelViewSet):
    queryset = CourseTag.objects.all()
    serializer_class = CourseTagSerializer
    filter_backends = [
        CaseInsensitiveOrderingFilter,
        filters.SearchFilter,
    ]
    search_fields = ['title']
    ordering_fields = ['title']
    ordering_case_insensitive_fields = [
        'title',
    ]
