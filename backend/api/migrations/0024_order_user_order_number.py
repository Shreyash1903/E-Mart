# Generated by Django 5.2.1 on 2025-06-15 08:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0023_alter_product_brand'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='user_order_number',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]
