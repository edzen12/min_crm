from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.branches.models import Branch
from apps.courses.models import Course
from apps.klasses import constants


class Klass(models.Model):
    course = models.ForeignKey(
        Course,
        related_name='klasses',
        on_delete=models.CASCADE,
        verbose_name='Курс'
    )
    klass_id = models.CharField(max_length=255, blank=True, db_index=True)
    classroom_link = models.URLField(verbose_name='Ссылка на Google Classroom')
    branch = models.ForeignKey(
        Branch,
        on_delete=models.SET_NULL,
        verbose_name='Филиал',
        related_name='klasses',
        null=True
    )
    base = models.CharField(
        'База',
        max_length=255,
        choices=constants.CLASS_BASE_CHOICES,
        default=constants.NINE,
    )

    def __str__(self):
        return self.klass_id

    class Meta:
        verbose_name = 'Класс'
        verbose_name_plural = 'Классы'
        ordering = ('-id',)


@receiver(post_save, sender=Klass)
def create_klass_id(sender, instance, created, *args, **kwargs):
    if created:
        instance.klass_id = f"{instance.course.title}-{instance.pk}"
        instance.save()
