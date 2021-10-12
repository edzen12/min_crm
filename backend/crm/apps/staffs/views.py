from django.db.models import F
from rest_framework import viewsets, filters, mixins
from django_filters.rest_framework import DjangoFilterBackend

from apps.staffs.models import StaffMember
from apps.staffs.serializers import StaffSerializer
from utils.filters import CaseInsensitiveOrderingFilter


class StaffViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = StaffSerializer
    filter_backends = [
        CaseInsensitiveOrderingFilter,
        filters.SearchFilter,
        DjangoFilterBackend,
    ]
    filterset_fields = [
        'is_hr', 'is_sales',
        'is_marketing', 'is_finance',
        'user__gender', 'user__branch',
    ]
    ordering_fields = [
        'user__first_name', 'user__last_name',
        'user__email', 'branch_name',
        'user__phone_number', 'user__gender',
        'is_hr', 'is_sales',
        'is_marketing', 'is_finance',
    ]
    ordering_case_insensitive_fields = [
        'user__first_name', 'user__last_name',
        'user__email', 'branch_name',
        'user__phone_number',
    ]
    ordering_case_insensitive_fields = [
        'user__first_name', 'user__last_name',
        'branch_name',
    ]
    search_fields = [
        'user__first_name', 'user__last_name',
        'user__email', 'branch_name',
        'user__phone_number',
    ]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return StaffMember.objects.annotate(branch_name=F('user__branch__name'))

        return StaffMember.objects.filter(
            user__branch=self.request.user.branch).annotate(
            branch_name=F('user__branch__name')
        )
