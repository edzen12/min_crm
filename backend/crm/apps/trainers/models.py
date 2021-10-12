from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from utils.model_services import StaffCommonInfo
from apps.trainers import choices
from apps.klasses.models import Klass
from apps.branches.models import Branch

User = get_user_model()


class Trainer(StaffCommonInfo):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_trainer = models.BooleanField(default=True, verbose_name='Ментор')
    is_assistant = models.BooleanField(default=False, verbose_name='Ассистент')
    status = models.CharField(
        max_length=50,
        choices=choices.TRAINER_STATUSES,
        default=choices.WORKS,
        verbose_name='Текущий статус')
    klasses = models.ManyToManyField(
        Klass,
        related_name='trainers',
        verbose_name='Класс',
        blank=True
    )
    github = models.URLField(null=True, blank=True)
    portfolio = models.URLField(null=True, blank=True, verbose_name='Портфолио')

    class Meta:
        verbose_name = "Тренер"
        verbose_name_plural = "Тренеры"
        ordering = ('-id',)

    def __str__(self):
        return self.user.email


@receiver(post_save, sender=User)
def create_trainer(sender, instance, created, *args, **kwargs):
    if created and instance.is_trainer:
        Trainer.objects.create(user=instance)
