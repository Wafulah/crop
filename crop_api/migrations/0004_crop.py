# Generated by Django 4.0.4 on 2022-10-15 12:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crop_api', '0003_alter_county_k_alter_county_n_alter_county_p_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Crop',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
            ],
        ),
    ]
