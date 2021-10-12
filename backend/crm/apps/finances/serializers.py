from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.finances.models.expense_tags import ExpenseTag
from apps.finances.models.transaction import Transaction
from apps.finances.models.wallet import Wallet

User = get_user_model()


class WalletSerializer(serializers.ModelSerializer):

    class Meta:
        model = Wallet
        fields = '__all__'
        read_only_fields = ('wallet_id',)


class TransactionSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        slug_field='email', read_only=True
    )
    branch_name = serializers.CharField(read_only=True)
    wallet_name = serializers.CharField(read_only=True)

    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ('transaction_id',)


class IncomeSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        slug_field='email', read_only=True
    )
    wallet = serializers.SlugRelatedField(
        slug_field='wallet_id', queryset=Wallet.objects.all()
    )

    class Meta:
        model = Transaction
        fields = (
            'id', 'created_date', 'title', 'transaction_id',
            'amount', 'confirmation', 'comment', 'user',
            'wallet', 'transaction_type', 'branch'
        )
        read_only_fields = (
            'transaction_id', 'transaction_type', 'id', 'user'
        )

    def create(self, validated_data):
        instance = super().create(validated_data)
        instance.wallet.balance += instance.amount
        instance.wallet.save()
        return instance

    def update(self, instance, validated_data):
        amount = validated_data.get('amount')
        if amount:
            if amount < instance.amount:
                difference = instance.amount - amount
                instance.wallet.balance -= difference
            else:
                difference = amount - instance.amount
                instance.wallet.balance += difference
            instance.wallet.save()
        return super(IncomeSerializer, self).update(instance, validated_data)


class ExpenseSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        slug_field='email', read_only=True
    )
    wallet = serializers.SlugRelatedField(
        slug_field='wallet_id', queryset=Wallet.objects.all()
    )

    class Meta:
        model = Transaction
        fields = (
            'id', 'created_date', 'title', 'transaction_id',
            'amount', 'confirmation', 'comment', 'user',
            'wallet', 'transaction_type', 'categories', 'branch'
        )
        read_only_fields = (
            'transaction_id', 'transaction_type', 'user', 'id'
        )

    def create(self, validated_data):
        instance = super().create(validated_data)
        instance.wallet.balance -= instance.amount
        instance.wallet.save()
        return instance

    def update(self, instance, validated_data):
        amount = validated_data.get('amount')
        if amount:
            if amount < instance.amount:
                difference = instance.amount - amount
                instance.wallet.balance += difference
            else:
                difference = amount - instance.amount
                instance.wallet.balance -= difference
            instance.wallet.save()
        return super(ExpenseSerializer, self).update(instance, validated_data)


class StudentPaymentSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        slug_field='email', read_only=True
    )
    wallet = serializers.SlugRelatedField(
        slug_field='wallet_id', queryset=Wallet.objects.all()
    )

    class Meta:
        model = Transaction
        fields = (
            'id', 'created_date', 'title', 'transaction_id',
            'amount', 'confirmation', 'comment', 'user',
            'wallet', 'transaction_type', 'student', 'course',
            'method', 'branch'
        )
        read_only_fields = (
            'transaction_id', 'transaction_type', 'user', 'id'
        )

    def create(self, validated_data):
        instance = super().create(validated_data)
        instance.wallet.balance += instance.amount
        instance.student.contract_amount -= instance.amount
        instance.student.save()
        instance.wallet.save()
        return instance

    def update(self, instance, validated_data):
        amount = validated_data.get('amount')
        if amount:
            if amount < instance.amount:
                difference = instance.amount - amount
                instance.wallet.balance -= difference
            else:
                difference = amount - instance.amount
                instance.wallet.balance += difference
            instance.wallet.save()
        return super(StudentPaymentSerializer, self).update(instance, validated_data)


class ExpenseTagSerializer(serializers.ModelSerializer):

    class Meta:
        model = ExpenseTag
        fields = ('id', 'name')
