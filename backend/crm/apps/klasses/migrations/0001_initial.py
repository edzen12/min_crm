# Generated by Django 3.1 on 2020-11-03 15:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('courses', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Klass',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('klass_id', models.CharField(blank=True, db_index=True, max_length=255)),
                ('classroom_link', models.URLField(verbose_name='Ссылка на Google Classroom')),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='klasses', to='courses.course', verbose_name='Курс')),
            ],
            options={
                'verbose_name': 'Класс',
                'verbose_name_plural': 'Классы',
                'ordering': ('-id',),
            },
        ),
    ]