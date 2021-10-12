# Generated by Django 3.1 on 2020-12-08 16:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0013_auto_20201107_0418'),
    ]

    operations = [
        migrations.CreateModel(
            name='StudentCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(db_index=True, max_length=255, verbose_name='Описание')),
            ],
            options={
                'verbose_name': 'Категория студента',
                'verbose_name_plural': 'Категории студента',
                'ordering': ('-id',),
            },
        ),
        migrations.AddField(
            model_name='student',
            name='country',
            field=models.CharField(default='Кыргызстан', max_length=255, verbose_name='Страна'),
        ),
        migrations.AddField(
            model_name='student',
            name='region',
            field=models.CharField(choices=[('IK', 'Иссык-Кульская область'), ('CH', 'Чуйская область'), ('NR', 'Нарынская область'), ('TS', 'Таласская область'), ('OS', 'Ошская область'), ('JL', 'Джалал-Абадская область'), ('BT', 'Баткенская область')], default='CH', max_length=255, verbose_name='Регион'),
        ),
        migrations.AddField(
            model_name='student',
            name='category',
            field=models.ManyToManyField(blank=True, related_name='students', to='students.StudentCategory', verbose_name='Категории'),
        ),
    ]