# Generated by Django 3.1 on 2020-11-03 16:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('administrators', '0002_administrator_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='administrator',
            name='patent',
        ),
    ]
