# Generated by Django 3.1 on 2020-11-03 15:42

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CourseTag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(db_index=True, max_length=255, verbose_name='Тэг')),
            ],
            options={
                'verbose_name': 'ТЭГ КУРСА',
                'verbose_name_plural': 'ТЭГИ КУРСА',
                'ordering': ('-id',),
            },
        ),
        migrations.CreateModel(
            name='Partner',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255, verbose_name='Название')),
                ('description', models.TextField(verbose_name='Описание')),
                ('logo', models.ImageField(blank=True, null=True, upload_to='partners', verbose_name='Логотип')),
            ],
            options={
                'verbose_name': 'КОМПАНИЯ ПАРТНЕР',
                'verbose_name_plural': 'КОМПАНИИ ПАРТНЕРЫ',
                'ordering': ('-id',),
            },
        ),
        migrations.CreateModel(
            name='Scope',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=255, verbose_name='Название')),
            ],
            options={
                'verbose_name': 'СФЕРА ПРИМЕНЕНИЯ',
                'verbose_name_plural': 'СФЕРЫ ПРИМЕНЕНИЯ',
                'ordering': ('-id',),
            },
        ),
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(db_index=True, max_length=255, verbose_name='Название курса')),
                ('description', models.TextField(verbose_name='Описание курса')),
                ('status', models.CharField(choices=[('O', 'Открыт'), ('C', 'Завершен'), ('E', 'Набор')], max_length=255, verbose_name='Статус')),
                ('period', models.CharField(default='12', max_length=255, verbose_name='Длительность')),
                ('image', models.ImageField(blank=True, null=True, upload_to='courses_images', verbose_name='Изображение')),
                ('price', models.DecimalField(decimal_places=0, default=81000, max_digits=6, verbose_name='Стоимость (сом)')),
                ('program_link', models.URLField(verbose_name='Ссылка на программу курса')),
                ('partner', models.ManyToManyField(blank=True, related_name='courses', to='courses.Partner', verbose_name='Компания-партнер')),
                ('scopes', models.ManyToManyField(blank=True, related_name='courses', to='courses.Scope', verbose_name='Сферы применения')),
                ('tags', models.ManyToManyField(blank=True, related_name='courses', to='courses.CourseTag', verbose_name='Тэги')),
            ],
            options={
                'verbose_name': 'КУРС',
                'verbose_name_plural': 'КУРСЫ',
                'ordering': ('-id',),
            },
        ),
    ]
