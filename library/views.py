from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import LibraryItem
from .serializers import LibraryItemSerializer

# Create your views here.

class LibraryItemListCreateView(generics.ListCreateAPIView): # list all of the current user’s items + add new items
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

class AddLibraryItemFromRAWG(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        game_id = request.data.get("game_id")
        status_choice = request.data.get("status")

        if not game_id:
            return Response({"error": "game_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        if not status_choice:
            return Response({"error": "status is required"}, status=status.HTTP_400_BAD_REQUEST)

        valid_statuses = [choice[0] for choice in LibraryItem.STATUS_CHOICES]
        if status_choice not in valid_statuses:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        # Prevent duplicates
        if LibraryItem.objects.filter(
            user=request.user, game_id=game_id, status=status_choice
        ).exists():
            return Response({"error": "Item already exists"}, status=status.HTTP_400_BAD_REQUEST)

        # Create the item
        new_item = LibraryItem.objects.create(
            user=request.user,
            game_id=game_id,
            status=status_choice
        )

        serializer = LibraryItemSerializer(new_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)