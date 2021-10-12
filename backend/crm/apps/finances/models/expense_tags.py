from django.db import models


class ExpenseTag(models.Model):
    name = models.CharField(
        'Название категории',
        max_length=255,
        db_index=True,
        unique=True,
    )

    class Meta:
        verbose_name = 'Категория расхода'
        verbose_name_plural = 'Категории расходов'
        ordering = ('-id',)

    def __str__(self):
        return self.name
