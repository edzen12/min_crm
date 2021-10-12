from rest_framework import generics

from apps.finances import choices
from apps.finances.models.transaction import Transaction
from apps.finances.serializers import StudentPaymentSerializer


class StudentCreateAPIView(generics.CreateAPIView):
    queryset = Transaction.objects.filter(
        transaction_type=choices.STUDENT_PAYMENT
    )
    serializer_class = StudentPaymentSerializer

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user,
            transaction_type=choices.STUDENT_PAYMENT
        )
