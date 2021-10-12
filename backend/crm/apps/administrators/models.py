from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.branches.models import Branch
from utils.model_services import StaffCommonInfo

User = get_user_model()


class Administrator(StaffCommonInfo):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Администратор"
        verbose_name_plural = "Администраторы"
        ordering = ('-id',)

    def __str__(self):
        return f"{self.user.email} | admin"


@receiver(post_save, sender=User)
def create_administrator(sender, instance, created, *args, **kwargs):
    if created and instance.is_administrator:
        Administrator.objects.create(user=instance)
