from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import LibraryItem
from .serializers import LibraryItemSerializer
from rest_framework.decorators import api_view, permission_classes
import requests
from django.conf import settings


# Create your views here.

class LibraryItemListCreateView(generics.ListCreateAPIView): # list all of the current user's items + add new items
    serializer_class = LibraryItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LibraryItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class LibraryItemRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView): # view, update, delete a specific library item
    serializer_class = LibraryItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LibraryItem.objects.filter(user=self.request.user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_from_rawg(request):
    game_id = request.data.get("game_id")
    status_value = request.data.get("status", "wishlist")

    if not game_id:
        return Response({"error": "game_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Fetch game details from RAWG
    url = f"{settings.RAWG_BASE_URL}/games/{game_id}"
    params = {"key": settings.RAWG_API_KEY}
    rawg_response = requests.get(url, params=params)
    game = rawg_response.json()

    # Avoid duplicates
    exists = LibraryItem.objects.filter(
        user=request.user,
        game_id=game_id,
        status=status_value
    ).first()

    if exists:
        return Response({"error": "Already in library with this status"}, status=status.HTTP_400_BAD_REQUEST)

    # Create library item
    library_item = LibraryItem.objects.create(
        user=request.user,
        game_id=game_id,
        title=game.get("name"),
        background_image=game.get("background_image"),
        rating=game.get("rating"),
        status=status_value,
    )

    return Response(
        {"message": "Game added", "item_id": library_item.id},
        status=status.HTTP_201_CREATED
    )