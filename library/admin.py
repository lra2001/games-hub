from django.contrib import admin
from .models import LibraryItem

# Register your models here.

@admin.register(LibraryItem)
class LibraryItemAdmin(admin.ModelAdmin):
    list_display = ('user', 'game_id', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'game_id')