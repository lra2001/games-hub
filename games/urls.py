from django.urls import path
from .views import GameSearchView, GameDetailView

urlpatterns = [
    path("search/", GameSearchView.as_view(), name="game_search"),
    path("<int:game_id>/", GameDetailView.as_view(), name="game_detail"),
]