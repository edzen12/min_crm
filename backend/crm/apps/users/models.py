import datetime

from django.db import models
from django.contrib.auth.models import AbstractUser

from utils import generators
from utils.validators import phone_number_regex

from apps.users import choices
from apps.users.managers import CustomUserManager
from apps.branches.models import Branch


class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True, verbose_name='Основной Email')
    is_trainer = models.BooleanField(default=False, verbose_name='Тренер')
    is_student = models.BooleanField(default=False, verbose_name='Студент')
    is_administrator = models.BooleanField(default=False, verbose_name='Администратор')
    is_staff_member = models.BooleanField(default=False, verbose_name='Сотрудник')
    phone_number = models.CharField(
        max_length=13,
        validators=[phone_number_regex],
        blank=True, null=True,
        verbose_name='Номер телефона'
    )
    second_phone_number = models.CharField(
        max_length=13,
        validators=[phone_number_regex],
        blank=True, null=True,
        verbose_name='Резервный номер телефона'
    )
    birth_date = models.DateField(
        default=datetime.date.today,
        verbose_name='Дата рождения'
    )
    gender = models.CharField(
        max_length=10,
        choices=choices.GENDER_CHOICES,
        verbose_name='Пол'
    )
    instagram = models.URLField(null=True, blank=True)
    facebook = models.URLField(null=True, blank=True)
    linkedin = models.URLField(null=True, blank=True)
    telegram = models.URLField(null=True, blank=True)
    branch = models.ForeignKey(
        Branch,
        on_delete=models.SET_NULL,
        verbose_name='Филиал',
        related_name='users',
        null=True
    )
    avatar = models.ImageField(
        upload_to=generators.generate_image_filename,
        verbose_name='Фото профиля',
        null=True, blank=True,
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"
        ordering = ('-id',)

    def __str__(self):
        return self.email
