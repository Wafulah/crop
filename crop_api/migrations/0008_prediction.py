# Generated by Django 4.0.4 on 2022-12-09 21:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crop_api', '0007_csv_sheet_alter_csv_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Prediction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('crop', models.CharField(max_length=50)),
                ('crop_yield', models.IntegerField()),
                ('profit', models.IntegerField()),
            ],
        ),
    ]