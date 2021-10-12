from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.decorators import action

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from django.db.models import Sum, F
from django.db.models.functions import ExtractYear, ExtractMonth

from apps.finances.models.wallet import Wallet
from apps.finances.models.transaction import Transaction
from apps.finances.choices import TRANSACTION_CHOICES
from apps.branches.models import Branch
from apps.analytics.serializers.finances import (
    FinancesBranchesSerializer, 
    StudentsPaymentsSerializer, 
    StudentsPaymentsCoursesSerializer, 
)

from .students import response_example


class FinancesAnalyticsViewSet(viewsets.ViewSet):
    @swagger_auto_schema(
        responses={
            200: response_example(
                FinancesBranchesSerializer, 
                description='Общий баланс филлиалов'
            )
        }
    )
    @action(detail=False, url_path='finances-brances')
    def finances_branches(self, request):
        brances = Branch.objects.annotate(balance=Sum('wallets__balance')).\
                  values('name', 'balance')
        return Response(brances)

    @swagger_auto_schema(
        responses={
            200: response_example(
                StudentsPaymentsSerializer, 
                description='Плата студентов по годам и месяцам'
            )
        }
    )
    @action(detail=False, url_path='students-payments')
    def students_payments(self, request):
        students_payments = Transaction.objects.\
                            filter(transaction_type=TRANSACTION_CHOICES[2][0]).\
                            annotate(year=ExtractYear('created_date')).values('year').\
                            annotate(month=ExtractMonth('created_date')).\
                            annotate(summary=Sum('amount')).\
                            order_by('year')
        return Response(students_payments)

    @swagger_auto_schema(
        responses={
            200: response_example(
                StudentsPaymentsCoursesSerializer, 
                description='Плата студентов за курсы'
            )
        }
    )
    @action(detail=False, url_path='students-payments-courses')
    def students_payments_courses(self, request):
        students_payments = Transaction.objects.\
                            filter(transaction_type=TRANSACTION_CHOICES[2][0]).\
                            annotate(name=F('course__title')).values('name').\
                            annotate(summary=Sum('amount')).order_by('course__title')
        return Response(students_payments)

    @swagger_auto_schema(
        responses={
            200: response_example(
                StudentsPaymentsSerializer, 
                description='Доходы по годам и месяцам'
            )
        }
    )
    @action(detail=False, url_path='incomes')
    def incomes(self, request):
        incomes = Transaction.objects.\
                  filter(transaction_type=TRANSACTION_CHOICES[0][0]).\
                  annotate(year=ExtractYear('created_date')).values('year').\
                  annotate(month=ExtractMonth('created_date')).\
                  annotate(summary=Sum('amount')).\
                  order_by('year')
        return Response(incomes)

    @swagger_auto_schema(
        responses={
            200: response_example(
                StudentsPaymentsSerializer, 
                description='Расходы по годам и месяцам'
            )
        }
    )
    @action(detail=False, url_path='expences')
    def expences(self, request):
        expences = Transaction.objects.\
                  filter(transaction_type=TRANSACTION_CHOICES[1][0]).\
                  annotate(year=ExtractYear('created_date')).values('year').\
                  annotate(month=ExtractMonth('created_date')).\
                  annotate(summary=Sum('amount')).\
                  order_by('year')
        return Response(expences)

    @swagger_auto_schema(
        responses={
            200: response_example(
                StudentsPaymentsCoursesSerializer, 
                description='Расходы по категориям'
            )
        }
    )
    @action(detail=False, url_path='expences-categories')
    def expences_categories(self, request):
        expences = Transaction.objects.\
                   filter(transaction_type=TRANSACTION_CHOICES[1][0]).\
                   annotate(name=F('categories__name')).values('name').\
                   annotate(summary=Sum('amount')).order_by('categories__name')
        return Response(expences)
