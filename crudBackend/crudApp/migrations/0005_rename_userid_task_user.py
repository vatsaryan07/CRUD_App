# Generated by Django 4.1 on 2024-03-13 00:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("crudApp", "0004_rename_taskid2_task_taskid"),
    ]

    operations = [
        migrations.RenameField(
            model_name="task",
            old_name="userid",
            new_name="user",
        ),
    ]