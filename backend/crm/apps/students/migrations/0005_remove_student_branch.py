# Generated by Django 3.1 on 2020-11-03 19:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0004_student_branch'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='student',
            name='branch',
        ),
    ]
