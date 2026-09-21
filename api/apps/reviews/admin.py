from django.contrib import admin

from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ["package", "user", "rating", "is_hidden", "created_at"]
    list_filter = ["is_hidden", "rating"]
    search_fields = ["package__name", "user__email", "comment"]
    autocomplete_fields = ["booking", "package", "user"]
