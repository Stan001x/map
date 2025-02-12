# Generated by Django 5.1.2 on 2025-01-20 05:19

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Regions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('region_rus_name1', models.CharField(max_length=50)),
                ('slug', models.SlugField(blank=True, default='', max_length=255)),
                ('region_rus_name2', models.CharField(max_length=50)),
                ('lat', models.DecimalField(decimal_places=6, max_digits=9)),
                ('lng', models.DecimalField(decimal_places=6, max_digits=9)),
                ('is_published', models.BooleanField(default=True)),
            ],
            options={
                'verbose_name': 'Список регионов',
                'verbose_name_plural': 'Список регионов',
                'ordering': ['region_rus_name1'],
            },
        ),
    ]
