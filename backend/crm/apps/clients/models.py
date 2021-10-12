from django.db import models
from django.utils import timezone

from apps.branches.models import Branch
from apps.courses.models import Course
from utils.validators import phone_number_regex

COMM_TYPES = (
    ('WHATSAPP', 'WHATSAPP'),
    ('INSTAGRAM', 'INSTAGRAM'),
    ('FACEBOOK', 'FACEBOOK'),
    ('TELEGRAM', 'TELEGRAM'),
    ('INCOMING', 'INCOMING CALL'),
    ('WEBSITE', 'WEBSITE'),
    ('OFFICE', 'OFFICE')
)


class Client(models.Model):
    name = models.CharField(max_length=255, db_index=True, verbose_name='Имя')
    last_name = models.CharField(max_length=255, db_index=True, verbose_name='Фамилия')
    old_name = models.CharField(
        max_length=255, db_index=True,
        verbose_name='Отчество',
        blank=True, null=True
    )
    email = models.EmailField(blank=True)
    age = models.PositiveIntegerField(blank=True, null=True)
    telephone_number = models.CharField(
        max_length=255,
        validators=[phone_number_regex],
        verbose_name='Телефон',
        blank=True, null=True
    )
    contacted_from = models.CharField(
        choices=COMM_TYPES, max_length=255,
        verbose_name='Связался с'
    )
    test = models.BooleanField(
        default=False, verbose_name='Сдал тест',
        blank=True, null=True
    )
    came = models.BooleanField(
        default=False, verbose_name='Пришел на консультацию',
        blank=True, null=True
    )
    obrabotan = models.BooleanField(
        default=False, verbose_name='Обработан',
        blank=True, null=True
    )
    comment = models.TextField(blank=True, verbose_name='Комментарии')
    created = models.DateTimeField(verbose_name='Дата создани', default=timezone.now)
    otkaz = models.BooleanField(default=False, verbose_name='Oтказ')
    prichina_otkaza = models.TextField(verbose_name='Причина отказа', blank=True)
    paid = models.BooleanField(default=False, verbose_name='Оплатил')
    waiting = models.BooleanField(default=False, verbose_name='Ждет')
    contact_whatsapp = models.BooleanField(
        default=False,
        verbose_name='Написал(а) в Whatsapp',
    )
    contact_telegram = models.BooleanField(
        default=False,
        verbose_name='Написал(а) в Telegram',
    )
    contact_email = models.BooleanField(
        default=False,
        verbose_name='Написал(а) на почту',
    )
    contact_call = models.BooleanField(
        default=False,
        verbose_name='Позвонил(а)',
    )
    courses = models.ManyToManyField(
        Course,
        related_name='clients',
        verbose_name='Интересующие курсы',
        blank=True
    )
    branch = models.ForeignKey(
        Branch,
        on_delete=models.SET_NULL,
        verbose_name='Филиал',
        related_name='clients',
        null=True
    )

    class Meta:
        verbose_name = 'КЛИЕНТ'
        verbose_name_plural = 'КЛИЕНТЫ'
        ordering = ('-id',)

    def __str__(self):
        return self.name + " " + self.last_name
