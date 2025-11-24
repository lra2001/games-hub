from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.

User = get_user_model()

class LibraryItem(models.Model):
    STATUS_CHOICES = [
        ('favorite', 'Favorite'),
        ('wishlist', 'Wishlist'),
        ('played', 'Played'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='library_items')
    game_id = models.IntegerField(help_text='RAWG game ID')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'game_id', 'status') # user can’t add the same game to the same status twice
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.game_id} ({self.status})"