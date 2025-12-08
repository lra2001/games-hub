from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch

# Create your tests here.

class GameSearchTests(APITestCase):
    def setUp(self):
        self.search_url = reverse("game_search")  # /api/games/search/

    @patch("games.views.requests.get")
    def test_search_games_returns_results(self, mock_get):
        # fake RAWG response
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {
            "results": [
                {"id": 1, "name": "Test Game 1"},
                {"id": 2, "name": "Test Game 2"},
            ]
        }

        response = self.client.get(self.search_url, {"query": "mario"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("results", response.data)
        self.assertEqual(len(response.data["results"]), 2)
        self.assertEqual(response.data["results"][0]["name"], "Test Game 1")

class GameMediaTests(APITestCase):
    @patch("games.views.requests.get")
    def test_media_endpoint_ok(self, mock_get):
        # Fake RAWG response
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {
            "results": [],
        }

        url = reverse("game_media", kwargs={"game_id": 1})
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("screenshots", resp.data)
        self.assertIn("trailers", resp.data)
        self.assertIn("youtube", resp.data)