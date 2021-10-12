# Generated by Django 3.1 on 2020-11-05 16:24

from django.db import migrations, models
import utils.generators


class Migration(migrations.Migration):

    dependencies = [
        ('trainers', '0007_auto_20201105_0210'),
    ]

    operations = [
        migrations.AddField(
            model_name='trainer',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to=utils.generators.generate_image_filename, verbose_name='Фото для профиля'),
        ),
    ]
