# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-04-19 10:24
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0002_auto_20170308_2031'),
    ]

    operations = [
        migrations.CreateModel(
            name='seat',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('seat', models.IntegerField()),
                ('booked', models.BooleanField(default=False)),
            ],
        ),
    ]
