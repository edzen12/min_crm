from django.db.models import F, ExpressionWrapper, DecimalField
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters

from apps.inventories.models import Inventory
from apps.inventories.serializers import InventorySerializer
from utils.filters import CaseInsensitiveOrderingFilter


class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        CaseInsensitiveOrderingFilter,
    ]
    filterset_fields = ['branch']
    ordering_fields = [
        'title', 'amount', 'comment', 'branch_name'
        'total_price', 'branch__name', 'price', 'inventory_number'
    ]
    ordering_case_insensitive_fields = [
         'title', 'comment', 'branch_name', 'inventory_number'
    ]
    search_fields = [
        'title', 'amount', 'comment',
        'total_price', 'price', 'branch_name',
        'inventory_number'
    ]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Inventory.objects.annotate(
                total_price=ExpressionWrapper(
                    F('price') * F('amount'),
                    output_field=DecimalField(),
                ),
                branch_name=F('branch__name'),
            )
        return Inventory.objects.filter(
            branch=self.request.user.branch
        ).annotate(
            total_price=ExpressionWrapper(
                F('price') * F('amount'),
                output_field=DecimalField(),
            ),
            branch_name=F('branch__name'),
        )
