from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from .models import LibraryItem
from unittest.mock import patch
from django.conf import settings

# Create your tests here.

User = get_user_model()

class LibraryTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="libuser",
            email="libuser@example.com",
            password="testPwd!",
        )
        self.list_url = reverse("library_list_create")  # /api/library/
        # login to get token
        token_url = reverse("token_obtain_pair") # /api/users/token/
        res = self.client.post(
            token_url,
            {"username": "libuser", "password": "testPwd!"},
            format="json",
        )
        self.access = res.data["access"]

    def test_library_requires_authentication(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_and_delete_library_items(self):
        # Create items for this user
        item = LibraryItem.objects.create(
            user=self.user,
            game_id=1234,
            title="Test Game",
            status="wishlist",
        )

        # Auth with token
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access}")

        # List
        list_res = self.client.get(self.list_url)
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_res.data), 1)
        self.assertEqual(list_res.data[0]["title"], "Test Game")

        # Delete
        detail_url = reverse("library_detail", args=[item.id])
        del_res = self.client.delete(detail_url)
        self.assertEqual(del_res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(LibraryItem.objects.filter(id=item.id).exists())

class AddFromRawgTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="rawguser",
            email="rawg@example.com",
            password="testPwd!",
        )
        token_url = reverse("token_obtain_pair")
        res = self.client.post(
            token_url,
            {"username": "rawguser", "password": "testPwd!"},
            format="json",
        )
        self.access = res.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access}")
        self.add_url = reverse("add-from-rawg")  # /api/library/add-from-rawg/

    @patch("library.views.requests.get")
    def test_add_from_rawg_creates_item(self, mock_get):
        # Mock RAWG response
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {
            "id": 999,
            "name": "Mock Game",
            "background_image": "http://example.com/mock.jpg",
            "rating": 4.5,
        }

        data = {"game_id": 999, "status": "wishlist"}
        response = self.client.post(self.add_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            LibraryItem.objects.filter(
                user=self.user, game_id=999, status="wishlist"
            ).exists()
        )