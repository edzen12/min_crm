# Generated by Django 3.1 on 2020-11-05 19:46

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_user_branch'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='phone_number',
            field=models.CharField(blank=True, max_length=13, null=True, validators=[django.core.validators.RegexValidator(message='Телефон должен быть в формате +996[код][номер]', regex='^(\\+996)\\d{9}$')], verbose_name='Номер телефона'),
        ),
        migrations.AlterField(
            model_name='user',
            name='second_phone_number',
            field=models.CharField(blank=True, max_length=13, null=True, validators=[django.core.validators.RegexValidator(message='Телефон должен быть в формате +996[код][номер]', regex='^(\\+996)\\d{9}$')], verbose_name='Резервный номер телефона'),
        ),
    ]