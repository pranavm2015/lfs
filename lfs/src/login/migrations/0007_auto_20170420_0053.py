# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-04-20 00:53
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0006_auto_20170420_0045'),
    ]

    operations = [
        migrations.AlterField(
            model_name='seat',
            name='booked',
            field=models.IntegerField(default=False),
        ),
    ]
