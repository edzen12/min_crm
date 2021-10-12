import random

from django.db import models

from apps.branches.models import Branch
from apps.finances import choices


class Wallet(models.Model):
    wallet_id = models.CharField(
        max_length=255,
        db_index=True,
        blank=True,
        unique=True,
        verbose_name='ID кошелька')
    name = models.CharField(
        max_length=255,
        verbose_name="Наименование кошелька",
        db_index=True)
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name='Описание')
    privacy = models.CharField(
        max_length=255,
        choices=choices.PRIVACY_CHOICES,
        default=choices.PRIVATE,
        verbose_name='Приватность')
    balance = models.DecimalField(
        decimal_places=2,
        max_digits=100,
        default=0.00,
        verbose_name='Баланс счета'
    )
    account_number = models.CharField(
        max_length=255,
        verbose_name="Номер счета",
        null=True,
        blank=True
    )
    branch = models.ForeignKey(
        Branch,
        on_delete=models.SET_NULL,
        verbose_name='Филиал',
        related_name='wallets',
        null=True
    )

    class Meta:
        verbose_name = 'Кошелёк'
        verbose_name_plural = 'Кошельки'
        ordering = ('-id',)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        num = random.randint(10, 99)
        self.wallet_id = f"{self.name}-{num}".upper()
        super(Wallet, self).save(*args, **kwargs)
