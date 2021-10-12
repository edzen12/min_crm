from django.db.models import F
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.klasses.serializers import KlassSerializer, KlassGetSerializer
from apps.klasses.models import Klass
from apps.students.serializers import StudentSerializer
from utils.filters import CaseInsensitiveOrderingFilter


class KlassAPIViewSet(viewsets.ModelViewSet):
    serializer_class = KlassSerializer
    filter_backends = [
        DjangoFilterBackend,
        CaseInsensitiveOrderingFilter,
        filters.SearchFilter,
    ]
    filterset_fields = ['branch', 'base']
    search_fields = [
        'klass_id', 'course__title',
        'branch__name', 'base',
    ]
    ordering_fields = [
        'klass_id', 'course__title',
        'branch__name', 'base',
    ]
    ordering_case_insensitive_fields = [
        'klass_id', 'course__title',
        'branch__name'
    ]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Klass.objects.annotate(branch_name=F('branch__name'))

        return Klass.objects.filter(branch=self.request.user.branch).annotate(
            branch_name=F('branch__name')
        )

    @action(detail=True, methods=['get'])
    def students(self, request, pk=None):
        klass = self.get_object()
        students = klass.students.all()
        page = self.paginate_queryset(students)
        if page is not None:
            serializer = StudentSerializer(students, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(students, many=True)
        return Response(serializer.data)

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return KlassGetSerializer
        return self.serializer_class
