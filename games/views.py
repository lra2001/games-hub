import requests
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions

# Create your views here.

class GameSearchView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.GET.get("query", "").strip()

        # If there is no input from user, return empty results instead of 400
        if not query:
            return Response({"results": []}, status=status.HTTP_200_OK)

        url = f"{settings.RAWG_BASE_URL}/games"
        params = {
            "search": query,
            "key": settings.RAWG_API_KEY,
            "page_size": 10,
        }

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