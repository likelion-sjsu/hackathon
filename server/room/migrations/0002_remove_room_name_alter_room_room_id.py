# Generated by Django 5.0.1 on 2024-01-20 22:57

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("room", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="room",
            name="name",
        ),
        migrations.AlterField(
            model_name="room",
            name="room_id",
            field=models.CharField(max_length=22, unique=True),
        ),
    ]
