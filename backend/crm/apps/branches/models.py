from django.db import models

from utils.validators import phone_number_regex
from apps.branches import constants


class Branch(models.Model):
    name = models.CharField(
        'Название',
        max_length=255,
        db_index=True
    )
    oblast = models.CharField(
        'Область',
        max_length=255,
        choices=constants.OBLAST_CHOICES
    )
    city = models.CharField(
        'Город или населенный пункт',
        max_length=255
    )
    address = models.CharField(
        'Адрес',
        max_length=255
    )
    email = models.EmailField(
        'Электронная почта',
        unique=True,
    )
    telephone_number = models.CharField(
        max_length=255,
        validators=[phone_number_regex],
        verbose_name='Телефон',
        blank=True, null=True
    )
    description = models.TextField('Описание')
    class9 = models.BooleanField('9-класс', default=True)
    class10 = models.BooleanField('10-ый класс', default=True)
    class11 = models.BooleanField('11-ый класс', default=True)
    for_superusers = models.BooleanField(default=False, verbose_name='Для суперпользователей')

    class Meta:
        verbose_name = 'Филиал'
        verbose_name_plural = 'Филиалы'
        ordering = ['id']

    def __str__(self):
        return self.name

    @property
    def administrators(self):
        return self.users.filter(is_administrator=True)

    @property
    def trainers(self):
        return self.users.filter(is_trainer=True)

    @property
    def staffs(self):
        return self.users.filter(is_staff_member=True)

    @property
    def students(self):
        return self.users.filter(is_student=True)

    @property
    def courses(self):
        return self.courses.all()
