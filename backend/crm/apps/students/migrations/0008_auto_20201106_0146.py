# Generated by Django 3.1 on 2020-11-05 19:46

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0007_auto_20201105_2336'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='father_phone_number',
            field=models.CharField(blank=True, max_length=13, null=True, validators=[django.core.validators.RegexValidator(message='Телефон должен быть в формате +996[код][номер]', regex='^(\\+996)\\d{9}$')], verbose_name='Номер телефона отца'),
        ),
        migrations.AlterField(
            model_name='student',
            name='mother_phone_number',
            field=models.CharField(blank=True, max_length=13, null=True, validators=[django.core.validators.RegexValidator(message='Телефон должен быть в формате +996[код][номер]', regex='^(\\+996)\\d{9}$')], verbose_name='Номер телефона матери'),
        ),
        migrations.AlterField(
            model_name='student',
            name='status',
            field=models.CharField(choices=[('A', 'Активный'), ('L', 'Ушёл'), ('G', 'Окончил')], default='A', max_length=255, verbose_name='Текущий статус'),
        ),
    ]
