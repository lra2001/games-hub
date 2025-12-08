from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.tokens import default_token_generator

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

class PasswordResetFlowTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="resetuser",
            email="reset@example.com",
            password="oldpassword123",
        )
        self.request_url = reverse("password_reset")
        self.confirm_url = reverse("password_reset_confirm")

    def test_request_reset_returns_generic_success(self):
        resp = self.client.post(self.request_url, {"email": "reset@example.com"})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("message", resp.data)

    def test_request_reset_for_unknown_email_is_still_200(self):
        resp = self.client.post(self.request_url, {"email": "nobody@example.com"})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_confirm_reset_changes_password(self):
        token = default_token_generator.make_token(self.user)
        uid = self.user.pk

        resp = self.client.post(self.confirm_url, {
            "uid": uid,
            "token": token,
            "password": "newpassword123",
        })
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        # Old password no longer works
        login_resp = self.client.post(
            reverse("token_obtain_pair"),
            {"username": "resetuser", "password": "oldpassword123"},
        )
        self.assertEqual(login_resp.status_code, status.HTTP_401_UNAUTHORIZED)

        # New password works
        login_resp2 = self.client.post(
            reverse("token_obtain_pair"),
            {"username": "resetuser", "password": "newpassword123"},
        )
        self.assertEqual(login_resp2.status_code, status.HTTP_200_OK)