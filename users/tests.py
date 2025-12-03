from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

# Create your tests here.

User = get_user_model()


class UserAuthTests(APITestCase):
    def setUp(self):
        self.register_url = reverse("auth_register")         # /api/users/register/
        self.token_url = reverse("token_obtain_pair")  # /api/users/token/
        self.me_url = reverse("user_profile")         # /api/users/me/

    def test_register_user(self):
        data = {
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "testPwd!",
            "password2": "testPwd!",
            "first_name": "Test",
            "last_name": "User",
        }
        response = self.client.post(self.register_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="testuser").exists())

    def test_login_and_get_me(self):
        # Create user
        user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="testPwd!",
        )

        # Login to get JWT tokens
        login_data = {
            "username": "testuser",
            "password": "testPwd!",
        }
        response = self.client.post(self.token_url, login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        access = response.data["access"]

        # Use access token to hit /me/
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        me_response = self.client.get(self.me_url)
        self.assertEqual(me_response.status_code, status.HTTP_200_OK)
        self.assertEqual(me_response.data["username"], "testuser")
        self.assertEqual(me_response.data["email"], "testuser@example.com")