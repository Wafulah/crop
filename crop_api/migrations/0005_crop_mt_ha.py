# Generated by Django 4.0.4 on 2022-10-15 12:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crop_api', '0004_crop'),
    ]

    operations = [
        migrations.AddField(
            model_name='crop',
            name='mt_ha',
            field=models.CharField(default=1, max_length=50),
            preserve_default=False,
        ),
    ]
