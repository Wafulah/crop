# Generated by Django 4.1.6 on 2023-02-23 08:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crop_api', '0010_crop_image_crop_info'),
    ]

    operations = [
        migrations.AddField(
            model_name='crop',
            name='cost',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]