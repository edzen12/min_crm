# Generated by Django 3.1 on 2020-11-07 20:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('klasses', '0002_klass_branch'),
    ]

    operations = [
        migrations.AddField(
            model_name='klass',
            name='base',
            field=models.CharField(choices=[('11', '11'), ('10', '10'), ('9', '9')], default='9', max_length=255, verbose_name='База'),
        ),
    ]