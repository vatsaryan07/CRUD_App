# Generated by Django 5.0.3 on 2024-03-15 07:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("crudApp", "0020_rename_userid_user_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="task",
            name="taskid",
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
