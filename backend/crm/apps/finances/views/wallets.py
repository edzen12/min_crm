from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters

from apps.finances.models.wallet import Wallet
from apps.finances.serializers import WalletSerializer
from utils.filters import CaseInsensitiveOrderingFilter


class WalletViewSet(viewsets.ModelViewSet):
    queryset = Wallet.objects.all()
    serializer_class = WalletSerializer
    filter_backends = [
        DjangoFilterBackend,
        CaseInsensitiveOrderingFilter,
        filters.SearchFilter,
    ]
    filterset_fields = ['privacy']
    ordering_fields = [
        'wallet_id', 'name', 'account_number',
        'balance', 'branch__name', 'branch'
    ]
    ordering_case_insensitive_fields = [
        'name', 'branch__name',
    ]
    search_fields = [
        'wallet_id', 'name', 'account_number',
        'branch__name',
    ]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Wallet.objects.all()
        return Wallet.objects.filter(branch=self.request.user.branch)
