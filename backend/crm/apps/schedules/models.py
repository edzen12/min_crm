from django.db import models
from apps.klasses.models import Klass
from apps.students.models import Student
from django.db.models.signals import post_save
from django.dispatch import receiver

from utils import generators


class Attendance(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        verbose_name='Студетн',
        related_name='attendances',
    )
    status = models.BooleanField(
        default=False,
        verbose_name='Посещение'
    )
    schedule = models.ForeignKey(
        'Schedule',
        on_delete=models.CASCADE,
        verbose_name='День',
        related_name='schedule_attendances'
    )

    class Meta:
        verbose_name = 'ПОСЕЩАЕМОСТЬ'
        verbose_name_plural = 'ПОСЕЩАЕМОСТИ'
        ordering = ('-id',)

    def __str__(self):
        return f"{self.student.user.email} | {self.status}"


class Schedule(models.Model):
    title = models.CharField(
        max_length=255,
        db_index=True,
        verbose_name='Название темы'
    )
    klass = models.ForeignKey(
        Klass,
        related_name='schedules',
        verbose_name='Класс',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    day = models.DateField(verbose_name='Дата события')
    material = models.FileField(
        verbose_name=generators.generate_document_filename,
        upload_to='material',
        blank=True, null=True
    )
    start_time = models.TimeField(verbose_name='Время начало урока')
    end_time = models.TimeField(verbose_name='Время до конца урока')
    homework_link = models.URLField(
        verbose_name='Ссылка на домашние задание'
    )

    def __str__(self):
        return str(self.day)

    class Meta:
        verbose_name = 'ГРАФИК'
        verbose_name_plural = 'ГРАФИКИ'
        ordering = ('-id',)


@receiver(post_save, sender=Schedule)
def create_attendance(sender, instance, created, *args, **kwargs):
    if created:
        students = instance.klass.students.all()
        for student in students:
            Attendance.objects.create(schedule=instance, status=False, student=student)
