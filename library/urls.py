from django.urls import path
from .views import (
    LibraryItemListCreateView,
    LibraryItemRetrieveUpdateDestroyView,
    add_from_rawg
    )

urlpatterns = [
    path('', LibraryItemListCreateView.as_view(), name='library_list_create'),
    path('<int:pk>/', LibraryItemRetrieveUpdateDestroyView.as_view(), name='library_detail'),
    path("add-from-rawg/", add_from_rawg, name="add-from-rawg"),
]