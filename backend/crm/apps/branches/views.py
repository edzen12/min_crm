from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from apps.branches.models import Branch
from apps.branches.serializers import BranchSerializer
from utils.filters import CaseInsensitiveOrderingFilter


class BranchViewSet(viewsets.ModelViewSet):
    serializer_class = BranchSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        CaseInsensitiveOrderingFilter,
    ]
    filterset_fields = ['class9', 'class10', 'class11']
    ordering_fields = [
        'name', 'oblast', 'city',
        'address', 'email', 'telephone_number',
    ]
    ordering_case_insensitive_fields = [
        'name', 'oblast', 'city',
        'address',
    ]
    search_fields = [
        'name', 'oblast', 'city',
        'address', 'email', 'telephone_number',
    ]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Branch.objects.all()
        return Branch.objects.all().exclude(for_superusers=True)
