from django.db.models import F
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters, mixins

from apps.students.models import Student, StudentCategory
from apps.students.serializers import (
    StudentSerializer, StudentCategorySerializer, StudentDetailSerializer
)
from utils.filters import CaseInsensitiveOrderingFilter


class StudentViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = StudentSerializer
    filter_backends = [
        DjangoFilterBackend,
        CaseInsensitiveOrderingFilter,
        filters.SearchFilter,

    ]
    filterset_fields = [
        'status', 'user__gender', 'user__branch', 'region', 'category'
    ]
    ordering_fields = [
        'student_id', 'user__first_name',
        'user__last_name', 'user__email',
        'user__phone_number', 'user__birth_date',
        'user__gender', 'branch_name', 'klass_name',
        'country', 'region',
    ]
    ordering_case_insensitive_fields = [
        'student_id', 'user__first_name',
        'user__last_name', 'user__email',
        'branch_name', 'klass_name', 'category__title',
        'country', 'region',
    ]
    search_fields = [
        'student_id', 'user__first_name',
        'user__last_name', 'user__email',
        'user__phone_number', 'user__birth_date',
        'user__gender', 'branch_name',
        'klass_name', 'category__title', 'country',
        'region',
    ]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Student.objects.annotate(
                klass_name=F('klass__klass_id'),
                branch_name=F('user__branch__name'),
            )
        return Student.objects.filter(
            user__branch=self.request.user.branch).annotate(
            klass_name=F('klass__klass_id'),
            branch_name=F('user__branch__name'),
        )

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return StudentDetailSerializer
        return self.serializer_class


class StudentCategoryAPIViewSet(viewsets.ModelViewSet):
    queryset = StudentCategory.objects.all()
    serializer_class = StudentCategorySerializer
