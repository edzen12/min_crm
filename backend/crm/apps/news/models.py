from django.db import models
from django.utils import timezone

from utils.generators import generate_image_filename

from apps.branches.models import Branch


class New(models.Model):
    title = models.CharField(max_length=255, verbose_name='Заголовок')
    content = models.TextField(verbose_name='Описание')
    datetime = models.DateTimeField('Дата и время', default=timezone.now)
    branch = models.ForeignKey(
        Branch, on_delete=models.CASCADE, related_name='news',
        verbose_name='Для филиала', null=True, blank=True,
    )
    for_all = models.BooleanField(default=False, verbose_name='Для всех филиалов')
    image = models.ImageField(upload_to=generate_image_filename, verbose_name='Изображение', null=True, blank=True)

    class Meta:
        ordering = ('-id',)
        verbose_name = 'Новость'
        verbose_name_plural = 'Новости'

    def __str__(self):
        return self.title
