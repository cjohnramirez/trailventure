# Generated by Django 4.2.10 on 2025-03-05 13:01

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('packages', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdditionalFees',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tax_paid_percent', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('site_fees_percent', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
            ],
            options={
                'verbose_name_plural': 'additional fees',
            },
        ),
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('num_of_person', models.PositiveIntegerField()),
                ('booking_date', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('package_type', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='booking', to='packages.packagetype')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='booking', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed')], default='pending', max_length=10)),
                ('currency', models.CharField(blank=True, max_length=3, null=True)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('transfer_date', models.DateTimeField(auto_now_add=True)),
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
            options={
                'verbose_name_plural': 'package reviews',
            },
        ),
    ]
