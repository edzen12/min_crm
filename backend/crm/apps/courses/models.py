from django.db import models

from apps.branches.models import Branch

from utils import generators


class CourseTag(models.Model):
    title = models.CharField(max_length=255, db_index=True, verbose_name='Тэг')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'ТЭГ КУРСА'
        verbose_name_plural = 'ТЭГИ КУРСА'
        ordering = ('-id',)


class Course(models.Model):
    OPEN = 'O'
    CLOSER = 'C'
    ESTIMATION = 'E'

    COURSE_STATUS_CHOICES = (
        (OPEN, 'Открыт'),
        (CLOSER, 'Завершен'),
        (ESTIMATION, 'Набор')
    )
    title = models.CharField(
        max_length=255,
        db_index=True,
        verbose_name='Название курса'
    )
    description = models.TextField(verbose_name='Описание курса')
    status = models.CharField(
        max_length=255,
        choices=COURSE_STATUS_CHOICES,
        verbose_name='Статус'
    )
    period = models.CharField(
        max_length=255,
        default='12',
        verbose_name='Длительность'
    )
    image = models.ImageField(
        verbose_name='Изображение',
        upload_to=generators.generate_image_filename,
        blank=True, null=True
    )
    price = models.DecimalField(
        default=81000,
        decimal_places=0,
        max_digits=6,
        verbose_name='Стоимость (сом)'
    )
    program_link = models.URLField(verbose_name='Ссылка на программу курса')
    tags = models.ManyToManyField(
        CourseTag,
        related_name='courses',
        verbose_name='Тэги',
        blank=True
    )
    branch = models.ForeignKey(
        Branch,
        on_delete=models.SET_NULL,
        verbose_name='Филиал',
        related_name='courses',
        null=True
    )

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'КУРС'
        verbose_name_plural = 'КУРСЫ'
        ordering = ('-id',)
