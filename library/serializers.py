from rest_framework import serializers
from .models import LibraryItem

class LibraryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = LibraryItem
        fields = ('id', 'user', 'game_id', 'status', 'created_at')
        read_only_fields = ('user', 'created_at')