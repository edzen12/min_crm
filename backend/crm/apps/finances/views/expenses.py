from rest_framework import viewsets, filters, generics

from apps.finances import choices
from apps.finances.models.expense_tags import ExpenseTag
from apps.finances.models.transaction import Transaction
from apps.finances.serializers import (
    ExpenseSerializer,
    ExpenseTagSerializer
)


class ExpenseCreateAPIView(generics.CreateAPIView):
    queryset = Transaction.objects.filter(transaction_type=choices.EXPENSE)
    serializer_class = ExpenseSerializer

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user,
            transaction_type=choices.EXPENSE
        )


class ExpenseTagViewSet(viewsets.ModelViewSet):
    queryset = ExpenseTag.objects.all()
    serializer_class = ExpenseTagSerializer
    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ['name']
    ordering_fields = ['name']
