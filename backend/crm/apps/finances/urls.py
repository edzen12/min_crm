from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.finances.views.expenses import ExpenseCreateAPIView, ExpenseTagViewSet
from apps.finances.views.incomes import IncomeCreateAPIView
from apps.finances.views.student_payments import StudentCreateAPIView
from apps.finances.views.transactions import TransactionViewSet
from apps.finances.views.wallets import WalletViewSet


router = DefaultRouter()
router.register('wallets', WalletViewSet, basename='wallets')
router.register('transactions', TransactionViewSet, basename='transactions')
router.register('expense-tags', ExpenseTagViewSet, basename='expense_tags')

urlpatterns = [
    path('incomes/', IncomeCreateAPIView.as_view(), name='incomes'),
    path('expenses/', ExpenseCreateAPIView.as_view(), name='expenses'),
    path('student-payments/', StudentCreateAPIView.as_view(), name='student_payments'),
]

urlpatterns += router.urls
