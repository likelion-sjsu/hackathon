# Generated by Django 5.0.1 on 2024-01-20 22:22

import shortuuid.main
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Room",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                (
                    "room_id",
                    models.UUIDField(
                        default=shortuuid.main.ShortUUID.uuid, unique=True
                    ),
                ),
            ],
        ),
    ]
