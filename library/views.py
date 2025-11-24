from rest_framework import generics, permissions
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