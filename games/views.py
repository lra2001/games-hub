import requests
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions


class GameSearchView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.GET.get("query", "").strip()
        page = request.GET.get("page", 1)
        category = request.GET.get("category", "").strip().lower()

        url = f"{settings.RAWG_BASE_URL}/games"
        params = {
            "key": settings.RAWG_API_KEY,
            "page_size": 10,
            "page": page,
        }

        # Use RAWG search when user types a query
        if query:
            params["search"] = query

        # Map category names to RAWG ordering
        ordering_map = {
            "popular": "-rating",      # Most Popular
            "new": "-released",        # New Releases
            "average": "-metacritic",  # Average rating
        }
        ordering = ordering_map.get(category)

        # Default to popular if no query or ordering is specified
        if not query and not ordering:
            ordering = "-rating"

        if ordering:
            params["ordering"] = ordering

        try:
            rawg_response = requests.get(url, params=params)
            rawg_response.raise_for_status()
        except requests.exceptions.RequestException as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        data = rawg_response.json()
        return Response(data, status=status.HTTP_200_OK)


class GameDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, game_id):
        url = f"{settings.RAWG_BASE_URL}/games/{game_id}"
        params = {"key": settings.RAWG_API_KEY}

        try:
            rawg_response = requests.get(url, params=params)
            rawg_response.raise_for_status()
        except requests.exceptions.RequestException as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        data = rawg_response.json()
        return Response(data, status=status.HTTP_200_OK)