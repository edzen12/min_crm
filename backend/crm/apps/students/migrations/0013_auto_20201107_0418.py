# Generated by Django 3.1 on 2020-11-06 22:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('klasses', '0002_klass_branch'),
        ('students', '0012_remove_student_avatar'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='student',
            name='klasses',
        ),
        migrations.AddField(
            model_name='student',
            name='klass',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='students', to='klasses.klass', verbose_name='Класс'),
        ),
    ]
