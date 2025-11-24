from django.urls import path
from .views import LibraryItemListCreateView, LibraryItemRetrieveUpdateDestroyView

urlpatterns = [
    path('', LibraryItemListCreateView.as_view(), name='library_list_create'),
    path('<int:pk>/', LibraryItemRetrieveUpdateDestroyView.as_view(), name='library_detail'),
]