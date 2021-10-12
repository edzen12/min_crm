import datetime

from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import Q
from django.utils import timezone

from apps.branches.models import Branch
from apps.courses.models import Course
from apps.finances import choices
from apps.finances.models.expense_tags import ExpenseTag
from apps.finances.models.wallet import Wallet
from apps.students.models import Student
from utils import generators


User = get_user_model()


class Transaction(models.Model):
    created_date = models.DateTimeField(
        default=timezone.now,
        verbose_name='Дата создания'
    )
    title = models.CharField(
        max_length=255,
        verbose_name="Наименование транзакции",
        db_index=True
    )
    transaction_id = models.CharField(
        max_length=255,
        db_index=True,
        blank=True,
        unique=True,
        verbose_name='ID транзакции'
    )
    amount = models.DecimalField(
        max_digits=100,
        decimal_places=2,
        default=0.00,
        verbose_name='Сумма'
    )
    confirmation = models.FileField(
        upload_to=generators.generate_document_filename,
        null=True, blank=True,
        verbose_name="Прикрепите фото или скан чека"
    )
    comment = models.TextField(
        blank=True, null=True,
        verbose_name='Комментарии'
    )
    user = models.ForeignKey(
        User,
        related_name='transactions',
        on_delete=models.SET_NULL,
        null=True,
        verbose_name='Кто создал',
        limit_choices_to=(
                Q(is_administrator=True) |
                Q(is_staff_member=True) |
                Q(is_superuser=True)
        )
    )
    student = models.ForeignKey(
        Student,
        verbose_name='Студент',
        related_name='transactions',
        on_delete=models.SET_NULL,
        null=True, blank=True
    )
    course = models.ForeignKey(
        Course,
        verbose_name='Курс',
        related_name='transactions',
        on_delete=models.SET_NULL,
        null=True, blank=True
    )
    wallet = models.ForeignKey(
        Wallet,
        verbose_name='Кошелек',
        related_name='transactions',
        on_delete=models.SET_NULL,
        null=True
    )
    method = models.CharField(
        'Метод',
        max_length=255,
        choices=choices.METHOD_CHOICES,
        blank=True, null=True
    )
    categories = models.ManyToManyField(
        ExpenseTag,
        verbose_name='Категории расхода',
        related_name='transactions',
        blank=True,
    )
    transaction_type = models.CharField(
        'Тип транзакции',
        max_length=10,
        choices=choices.TRANSACTION_CHOICES
    )
    branch = models.ForeignKey(
        Branch,
        on_delete=models.SET_NULL,
        verbose_name='Филиал',
        related_name='transactions',
        null=True
    )

    class Meta:
        verbose_name = 'Транзакция'
        verbose_name_plural = 'Транзакции'
        ordering = ['-id']

    def __str__(self):
        return self.transaction_id

    def save(self, *args, **kwargs):
        trn_id = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
        self.transaction_id = f'trn-{trn_id}'
        super(Transaction, self).save(*args, **kwargs)
