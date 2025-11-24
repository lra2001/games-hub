from django.urls import path
from .views import (
    LibraryItemListCreateView,
    LibraryItemRetrieveUpdateDestroyView,
    AddLibraryItemFromRAWG,
    )

urlpatterns = [
    path('', LibraryItemListCreateView.as_view(), name='library_list_create'),
    path('<int:pk>/', LibraryItemRetrieveUpdateDestroyView.as_view(), name='library_detail'),
    path('add_from_rawg/', AddLibraryItemFromRAWG.as_view(), name='add_library_item_from_rawg'),
]