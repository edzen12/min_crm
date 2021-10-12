from django.contrib import admin

from apps.finances.models.expense_tags import ExpenseTag
from apps.finances.models.transaction import Transaction
from apps.finances.models.wallet import Wallet


class WalletAdmin(admin.ModelAdmin):
    list_display = ('wallet_id', 'balance')


class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        'transaction_id', 'title', 'amount', 'created_date',
        'user', 'wallet', 'transaction_type', 'comment',
    )
    list_filter = ('transaction_type', 'user', 'wallet')
    search_fields = (
        'transaction_id', 'title', 'amount', 'created_date',
        'comment', 'user__email', 'wallet__name', 'transaction_type'
    )


admin.site.register(Wallet, WalletAdmin)
admin.site.register(ExpenseTag)
admin.site.register(Transaction, TransactionAdmin)
