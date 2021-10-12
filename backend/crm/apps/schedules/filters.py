from django_filters import rest_framework as filters
from apps.schedules.models import Schedule


class ScheduleFilter(filters.FilterSet):
    """
    Example: http://127.0.0.1:8000/api/schedules/?day__gte=2020-09-17&day__lte=2020-09-20
    """

    class Meta:
        model = Schedule
        fields = {
            'day': ['gte', 'lte'],
        }
