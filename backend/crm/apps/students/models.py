import datetime

from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from utils.validators import phone_number_regex
from utils import generators

from apps.klasses.models import Klass

from apps.students import choices
from apps.branches.models import Branch

User = get_user_model()


class StudentCategory(models.Model):
    title = models.CharField(max_length=255, db_index=True, verbose_name='Описание')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Категория студента'
        verbose_name_plural = 'Категории студента'
        ordering = ('-id',)


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    enrollment_date = models.DateField(
        default=datetime.date.today,
        verbose_name='Дата поступления'
    )
    study_start_date = models.DateField(
        default=datetime.date.today,
        verbose_name='Дата начала учебы'
    )
    finish_date = models.DateField(
        null=True,
        verbose_name='Дата окончания учебы'
    )
    student_id = models.CharField(
        max_length=255,
        db_index=True,
        blank=True, null=True,
        verbose_name='ID студента'
    )
    status = models.CharField(
        max_length=255,
        choices=choices.STUDENT_STATUS_CHOICES,
        default=choices.ACTIVE,
        verbose_name='Текущий статус'
    )
    klass = models.ForeignKey(
        Klass,
        on_delete=models.SET_NULL,
        related_name='students',
        verbose_name='Класс',
        blank=True, null=True
    )
    address = models.TextField(
        verbose_name="Адрес проживания",
        blank=True, null=True
    )
    residence_address = models.TextField(
        verbose_name="Адрес прописки",
        blank=True, null=True
    )
    mother_name = models.TextField(
        blank=True, null=True,
        verbose_name='Имя матери'
    )
    mother_phone_number = models.CharField(
        max_length=13,
        validators=[phone_number_regex],
        blank=True, null=True,
        verbose_name='Номер телефона матери'
    )
    father_name = models.TextField(
        blank=True, null=True,
        verbose_name='Имя отца'
    )
    father_phone_number = models.CharField(
        max_length=13,
        validators=[phone_number_regex],
        blank=True, null=True,
        verbose_name='Номер телефона отца'
    )
    english_level = models.CharField(
        max_length=100,
        choices=choices.ENGLISH_LEVEL_CHOICES,
        null=True, blank=True,
        verbose_name='Уровень английского'
    )
    quit_reason = models.TextField(
        verbose_name="Причина ухода (если ушел)",
        blank=True, null=True
    )
    residence = models.CharField(
        max_length=255,
        verbose_name="Гражданство",
        null=True, blank=True
    )
    passport_number = models.CharField(
        max_length=20,
        null=True, blank=True,
        verbose_name='Номер паспорта'
    )
    authority = models.CharField(
        max_length=10,
        null=True, blank=True,
        verbose_name='Кем выдан')
    date_of_issue = models.DateField(
        default=datetime.date.today,
        verbose_name='Дата выдачи'
    )
    date_of_expire = models.DateField(
        default=datetime.date.today,
        verbose_name='Срок действия'
    )
    passport_scan = models.FileField(
        upload_to=generators.generate_document_filename,
        null=True, blank=True,
        verbose_name='Скан паспорта'
    )
    place_of_work = models.TextField(
        verbose_name="Место работы после выпуска",
        blank=True, null=True
    )
    info_from = models.CharField(
        max_length=255,
        verbose_name="Откуда узнал про академию",
        choices=choices.INFO_FROM_CHOICES,
        default=choices.SOCIAL_NETWORK
    )
    contract_amount = models.DecimalField(
        decimal_places=2,
        max_digits=100,
        verbose_name="Осталось заплатить",
        default=0
    )
    country = models.CharField(
        'Страна', max_length=255, default='Кыргызстан'
    )
    region = models.CharField(
        'Регион', max_length=255, choices=choices.OBLAST_CHOICES, default=choices.CHUY
    )
    category = models.ManyToManyField(
        StudentCategory,
        related_name='students',
        verbose_name='Категории',
        blank=True)

    class Meta:
        verbose_name = "Студент"
        verbose_name_plural = "Студенты"
        ordering = ('-id',)

    def __str__(self):
        return f"{self.user.email} | student"


@receiver(post_save, sender=User)
def create_student(sender, instance, created, *args, **kwargs):
    if created and instance.is_student:
        Student.objects.create(user=instance)


@receiver(post_save, sender=Student)
def create_student_id(sender, instance, created, *args, **kwargs):
    if created:
        std_id = str(instance.pk).zfill(6)
        instance.student_id = f"std-{std_id}"
        instance.save()
