# Generated by Django 3.1 on 2020-11-06 15:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0011_merge_20201106_1221'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='student',
            name='avatar',
        ),
    ]
