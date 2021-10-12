from rest_framework import generics

from apps.finances import choices
from apps.finances.models.transaction import Transaction
from apps.finances.serializers import IncomeSerializer


class IncomeCreateAPIView(generics.CreateAPIView):
    queryset = Transaction.objects.filter(transaction_type=choices.INCOME)
    serializer_class = IncomeSerializer

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user,
            transaction_type=choices.INCOME
        )
