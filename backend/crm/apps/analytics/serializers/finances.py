from rest_framework import serializers

from apps.finances.choices import TRANSACTION_CHOICES


class FinancesBranchesSerializer(serializers.Serializer):
    name = serializers.CharField()
    balance = serializers.DecimalField(max_digits=100, decimal_places=2)


class StudentsPaymentsSerializer(serializers.Serializer):
    year = serializers.IntegerField()
    month = serializers.IntegerField()
    summary = serializers.DecimalField(max_digits=100, decimal_places=2)


class StudentsPaymentsCoursesSerializer(serializers.Serializer):
    name = serializers.CharField()
    summary = serializers.DecimalField(max_digits=100, decimal_places=2)
