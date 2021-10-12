from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.branches.models import Branch
from utils.model_services import StaffCommonInfo

from django.contrib.auth import get_user_model


User = get_user_model()


class StaffMember(StaffCommonInfo):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_hr = models.BooleanField(default=False, verbose_name='HR')
    is_sales = models.BooleanField(default=False, verbose_name='Менеджер по продажам')
    is_marketing = models.BooleanField(default=False, verbose_name='Маркетолог')
    is_finance = models.BooleanField(default=False, verbose_name='Менеджер по финансам')

    class Meta:
        verbose_name = "Сотрудник"
        verbose_name_plural = "Сотрудники"
        ordering = ('-id',)

    def __str__(self):
        return f"{self.user.email} | staff" 


@receiver(post_save, sender=User)
def create_staff_member(sender, instance, created, *args, **kwargs):
    if created and instance.is_staff_member:
        StaffMember.objects.create(user=instance)
