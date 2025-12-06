from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserProfileSerializer

# Create your views here.

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class MeView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user

class PasswordResetRequestView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip()
        if not email:
            return Response({"error": "Email is required"}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Always respond with success to avoid leaking which emails exist
            return Response(
                {
                    "message": "If an account with this email exists, a password reset link was sent. Remember to check your spam/junk folder."
                }
            )

        token = default_token_generator.make_token(user)
        uid = user.pk

        reset_link = f"{settings.FRONTEND_URL}/password-reset-confirm/{uid}/{token}"

        # HTML email using template
        context = {
            "user": user,
            "reset_link": reset_link,
        }
        html_body = render_to_string("emails/password_reset.html", context)
        text_body = strip_tags(html_body)

        email_message = EmailMultiAlternatives(
            subject="Reset your GamesHub password",
            body=text_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[email],
        )
        email_message.attach_alternative(html_body, "text/html")
        email_message.send()

        return Response(
            {
                "message": "If an account with this email exists, a password reset link was sent. Remember to check your spam/junk folder."
            }
        )

class PasswordResetConfirmView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        password = request.data.get("password")

        if not (uid and token and password):
            return Response({"error": "Invalid request"}, status=400)

        try:
            user = User.objects.get(pk=uid)
        except User.DoesNotExist:
            return Response({"error": "Invalid user"}, status=400)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token"}, status=400)

        user.set_password(password)
        user.save()

        return Response({"message": "Password reset successful."})