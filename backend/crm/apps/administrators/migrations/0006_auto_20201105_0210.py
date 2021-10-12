# Generated by Django 3.1 on 2020-11-04 20:10

from django.db import migrations, models
import utils.generators


class Migration(migrations.Migration):

    dependencies = [
        ('administrators', '0005_remove_administrator_branch'),
    ]

    operations = [
        migrations.AlterField(
            model_name='administrator',
            name='contract',
            field=models.FileField(blank=True, null=True, upload_to=utils.generators.generate_document_filename, verbose_name='Скан договора'),
        ),
        migrations.AlterField(
            model_name='administrator',
            name='cv',
            field=models.FileField(blank=True, null=True, upload_to=utils.generators.generate_document_filename, verbose_name='Резюме'),
        ),
        migrations.AlterField(
            model_name='administrator',
            name='passport_scan',
            field=models.FileField(blank=True, null=True, upload_to=utils.generators.generate_document_filename, verbose_name='Скан паспорта'),
        ),
    ]