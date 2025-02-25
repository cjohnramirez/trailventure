# Generated by Django 5.1.6 on 2025-02-25 07:15

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('packages', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='AdditionalFees',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tax_paid_percent', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('site_fees', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('num_of_person', models.PositiveIntegerField()),
                ('amount_paid', models.DecimalField(decimal_places=2, max_digits=10)),
                ('is_confirmed', models.BooleanField(blank=True, default=False)),
                ('cancel_date', models.DateTimeField(null=True)),
                ('booking_date', models.DateTimeField(auto_now_add=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('package_type', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='booking', to='packages.packagetype')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='booking', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('currency', models.CharField(blank=True, max_length=3, null=True)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed')], default='pending', max_length=10)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('transfer_date', models.DateTimeField(auto_now_add=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('additional_fees', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='transaction', to='transactions.additionalfees')),
                ('booking', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='transaction', to='transactions.booking')),
            ],
        ),
        migrations.CreateModel(
            name='PackageReview',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment', models.TextField()),
                ('rating', models.DecimalField(decimal_places=1, max_digits=2, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('review_by_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='package_review', to=settings.AUTH_USER_MODEL)),
                ('transaction', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='package_review', to='transactions.transaction')),
            ],
        ),
    ]
