from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from apps.schedules.serializers import ScheduleSerializer
from apps.schedules.models import Schedule
from apps.schedules.filters import ScheduleFilter
from utils.filters import CaseInsensitiveOrderingFilter


class ScheduleAPIViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.prefetch_related('schedule_attendances').all()
    serializer_class = ScheduleSerializer
    filter_backends = [
        DjangoFilterBackend,
        CaseInsensitiveOrderingFilter,
        filters.SearchFilter
    ]
    filterset_class = ScheduleFilter
    ordering_fields = ['title', 'day', 'klass__klass_id']
    ordering_case_insensitive_fields = [
        'title', 'klass__klass_id',
    ]
    search_fields = ['title', 'klass__klass_id']
