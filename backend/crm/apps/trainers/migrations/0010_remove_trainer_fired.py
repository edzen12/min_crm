# Generated by Django 3.1 on 2020-11-06 20:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('trainers', '0009_remove_trainer_avatar'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='trainer',
            name='fired',
        ),
    ]
