import datetime
from utils import generators
from django.db import models


class StaffCommonInfo(models.Model):
    cv = models.FileField(
        upload_to=generators.generate_document_filename,
        null=True, blank=True,
        verbose_name='Резюме')
    salary = models.DecimalField(
        decimal_places=2, 
        max_digits=100, 
        verbose_name="Зарплата в USD",
        null=True, blank=True
    )
    contract = models.FileField(
        upload_to=generators.generate_document_filename,
        null=True, blank=True,
        verbose_name='Скан договора')
    passport_number = models.CharField(
        max_length=20,
        null=True, blank=True,
        verbose_name='Номер паспорта')
    authority = models.CharField(
        max_length=10,
        null=True, blank=True,
        verbose_name='Кем выдан')
    date_of_issue = models.DateField(
        default=datetime.date.today,
        verbose_name='Дата выдачи')
    date_of_expire = models.DateField(
        default=datetime.date.today,
        verbose_name='Срок действия')
    passport_scan = models.FileField(
        upload_to=generators.generate_document_filename,
        null=True, blank=True,
        verbose_name='Скан паспорта')
    start_work = models.DateField(
        null=True, blank=True,
        verbose_name="Дата прихода"
    )
    end_work = models.DateField(
        null=True, blank=True,
        verbose_name="Дата ухода"
    )
    end_work_cause = models.TextField(
        null=True, blank=True,
        verbose_name="Причина ухода"
    )

    class Meta:
        abstract = True
