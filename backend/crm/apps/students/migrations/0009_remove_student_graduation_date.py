# Generated by Django 3.1 on 2020-11-05 19:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0008_auto_20201106_0146'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='student',
            name='graduation_date',
        ),
    ]