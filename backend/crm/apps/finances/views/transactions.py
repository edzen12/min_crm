from django.db.models import F
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters, mixins

from apps.finances.models.transaction import Transaction
from apps.finances.serializers import TransactionSerializer
from apps.finances import serializers as tr_serializers
from utils.filters import CaseInsensitiveOrderingFilter


class TransactionViewSet(
    mixins.ListModelMixin,
    mixins.UpdateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    filter_backends = [
        DjangoFilterBackend,
        CaseInsensitiveOrderingFilter,
        filters.SearchFilter,
    ]
    filterset_fields = ['method', 'transaction_type', 'branch']
    ordering_fields = [
        'created_date', 'title', 'transaction_id',
        'user__first_name', 'user__last_name',
        'course__title', 'wallet__wallet_id',
        'branch__name', 'wallet__name', 'branch_name'
    ]
    ordering_case_insensitive_fields = [
        'title', 'user__first_name',
        'user__last_name', 'course__title',
        'branch__name', 'wallet__name', 'branch_name'
    ]
    search_fields = [
        'created_date', 'title', 'transaction_id',
        'comment', 'user__first_name', 'user__last_name',
        'course__title', 'wallet__name',
        'branch__name', 'branch_name'
    ]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Transaction.objects.annotate(
                branch_name=F('branch__name'),
                wallet_name=F('wallet__wallet_id'),
            )
        return Transaction.objects.filter(branch=self.request.user.branch).annotate(
            branch_name=F('branch__name'),
            wallet_name=F('wallet__wallet_id'),
        )

    def get_serializer_class(self):
        if getattr(self, 'swagger_fake_view', False):
            return self.serializer_class
        if self.action in ['retrieve', 'update', 'partial_update']:
            transaction = self.get_object()
            if transaction.transaction_type == 'INCOME':
                return tr_serializers.IncomeSerializer
            elif transaction.transaction_type == 'EXPENSE':
                return tr_serializers.ExpenseSerializer
            elif transaction.transaction_type == 'STUDENT':
                return tr_serializers.StudentPaymentSerializer
        return self.serializer_class

    def perform_destroy(self, instance):
        instance.wallet.balance -= instance.amount
        instance.wallet.save()
        instance.delete()
