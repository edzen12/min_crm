# Generated by Django 3.1 on 2020-11-05 12:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0006_auto_20201105_0210'),
        ('schedules', '0002_auto_20201105_0210'),
    ]

    operations = [
        migrations.CreateModel(
            name='Attendance',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.BooleanField(default=False, verbose_name='Посещение')),
                ('schedule', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='schedule_attendances', to='schedules.schedule', verbose_name='День')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attendances', to='students.student', verbose_name='Студетн')),
            ],
            options={
                'verbose_name': 'ПОСЕЩАЕМОСТЬ',
                'verbose_name_plural': 'ПОСЕЩАЕМОСТИ',
                'ordering': ('-id',),
            },
        ),
    ]
