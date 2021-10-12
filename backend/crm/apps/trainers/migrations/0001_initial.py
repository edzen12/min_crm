# Generated by Django 3.1 on 2020-11-03 15:42

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('klasses', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Trainer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cv', models.FileField(blank=True, null=True, upload_to='user_cvs', verbose_name='Резюме')),
                ('salary', models.DecimalField(blank=True, decimal_places=2, max_digits=100, null=True, verbose_name='Зарплата в USD')),
                ('patent', models.FileField(blank=True, null=True, upload_to='staff_patents', verbose_name='Патент')),
                ('contract', models.FileField(blank=True, null=True, upload_to='contracts', verbose_name='Скан договора')),
                ('passport_number', models.CharField(blank=True, max_length=20, null=True, verbose_name='Номер паспорта')),
                ('authority', models.CharField(blank=True, max_length=10, null=True, verbose_name='Кем выдан')),
                ('date_of_issue', models.DateField(default=datetime.date.today, verbose_name='Дата выдачи')),
                ('date_of_expire', models.DateField(default=datetime.date.today, verbose_name='Срок действия')),
                ('passport_scan', models.FileField(blank=True, null=True, upload_to='passport_scans', verbose_name='Скан паспорта')),
                ('fired', models.BooleanField(default=False)),
                ('start_work', models.DateField(blank=True, null=True, verbose_name='Дата прихода')),
                ('end_work', models.DateField(blank=True, null=True, verbose_name='Дата ухода')),
                ('end_work_cause', models.TextField(blank=True, null=True, verbose_name='Причина ухода')),
                ('is_trainer', models.BooleanField(default=True, verbose_name='Ментор')),
                ('is_assistant', models.BooleanField(default=False, verbose_name='Ассистент')),
                ('status', models.CharField(choices=[('W', 'Работает'), ('L', 'Не работает')], default='W', max_length=50, verbose_name='Текущий статус')),
                ('interview_comments', models.TextField(blank=True, verbose_name='Комментарии с интервью')),
                ('github', models.URLField(blank=True, null=True)),
                ('portfolio', models.URLField(blank=True, null=True, verbose_name='Портфолио')),
                ('klasses', models.ManyToManyField(blank=True, related_name='trainers', to='klasses.Klass', verbose_name='Класс')),
            ],
            options={
                'verbose_name': 'Тренер',
                'verbose_name_plural': 'Тренеры',
                'ordering': ('-id',),
            },
        ),
    ]
