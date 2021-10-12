from django.db.models import F
from rest_framework import viewsets, filters, mixins
from django_filters.rest_framework import DjangoFilterBackend

from apps.administrators.models import Administrator
from apps.administrators.serializers import AdministratorSerializer
from utils.filters import CaseInsensitiveOrderingFilter


class AdministratorViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = AdministratorSerializer
    filter_backends = [
        CaseInsensitiveOrderingFilter,
        filters.SearchFilter,
        DjangoFilterBackend,
    ]
    filterset_fields = [
        'user__gender', 'user__branch'
    ]
    ordering_fields = [
        'user__first_name', 'user__last_name',
        'user__email', 'user__phone_number',
        'user__birth_date', 'branch_name',
        'user__gender',
    ]
    ordering_case_insensitive_fields = [
        'user__first_name', 'user__last_name',
        'user__email', 'user__phone_number',
        'branch_name', 'user__gender',
    ]
    ordering_case_insensitive_fields = [
        'user__first_name', 'user__last_name',
        'branch_name',
    ]
    search_fields = [
        'user__first_name', 'user__last_name',
        'user__email', 'user__phone_number',
        'user__birth_date', 'branch_name',
        'user__gender',
    ]

    def get_queryset(self):
        branch = self.request.user.branch
        if self.request.user.is_superuser:
            return Administrator.objects.annotate(
                branch_name=F('user__branch__name')
            )
        return Administrator.objects.filter(user__branch=branch).annotate(
            branch_name=F('user__branch__name')
        )
