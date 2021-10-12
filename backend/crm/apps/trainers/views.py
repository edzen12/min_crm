from django.db.models import F
from rest_framework import filters, mixins, viewsets
from django_filters.rest_framework import DjangoFilterBackend

from apps.trainers.models import Trainer
from apps.trainers.serializers import TrainerSerializer
from utils.filters import CaseInsensitiveOrderingFilter


class TrainerViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = TrainerSerializer
    filter_backends = [
        CaseInsensitiveOrderingFilter,
        DjangoFilterBackend,
        filters.SearchFilter,
    ]
    filterset_fields = [
        'is_trainer', 'is_assistant', 'status',
        'user__gender', 'user__branch',
    ]
    ordering_fields = [
        'user__first_name', 'user__last_name',
        'user__email', 'user__phone_number',
        'user__birth_date', 'branch_name',
        'user__gender', 'is_trainer', 'is_assistant',
    ]
    ordering_case_insensitive_fields = [
        'user__first_name', 'user__last_name',
        'user__email', 'branch_name',
        'user__phone_number',
    ]
    ordering_case_insensitive_fields = [
        'user__first_name', 'user__last_name',
        'user__email', 'branch_name',
    ]
    search_fields = [
        'user__first_name', 'user__last_name',
        'user__email', 'user__phone_number',
        'user__birth_date', 'branch_name',
        'user__gender',
    ]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Trainer.objects.annotate(branch_name=F('user__branch__name'))

        return Trainer.objects.filter(
            user__branch=self.request.user.branch).annotate(
            branch_name=F('user__branch__name')
        )
