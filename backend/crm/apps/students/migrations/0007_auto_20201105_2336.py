# Generated by Django 3.1 on 2020-11-05 17:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0006_auto_20201105_0210'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='student',
            name='first_name_kirill',
        ),
        migrations.RemoveField(
            model_name='student',
            name='last_name_kirill',
        ),
    ]