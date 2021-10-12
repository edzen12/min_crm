from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.branches.models import Branch


class Inventory(models.Model):
    inventory_number = models.CharField(
        'Номер идентификации', max_length=255, blank=True
    )
    title = models.CharField('Название инвентаря', max_length=255)
    amount = models.PositiveIntegerField('Количество')
    price = models.DecimalField(
        'Стоимость за 1 штуку',
        decimal_places=2,
        max_digits=100
    )
    branch = models.ForeignKey(
        Branch, verbose_name='Филиал',
        on_delete=models.SET_NULL, null=True
    )
    comment = models.TextField('Комментарии', blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Инвентарь'
        verbose_name_plural = 'Инвентари'
        ordering = ['-id']


@receiver(post_save, sender=Inventory)
def set_inventory_number(sender, instance, created, *args, **kwargs):
    if created:
        instance.inventory_number = str(instance.pk).zfill(7)
        instance.save()
