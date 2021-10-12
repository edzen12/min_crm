# Generated by Django 3.1 on 2020-11-03 19:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('branches', '0001_initial'),
        ('staffs', '0003_remove_staffmember_patent'),
    ]

    operations = [
        migrations.AddField(
            model_name='staffmember',
            name='branch',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='staffs', to='branches.branch', verbose_name='Филиал'),
        ),
    ]