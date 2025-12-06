from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Profile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm password")

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name')

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        # use django password validators
        validate_password(data['password'], self.instance)
        return data

    def create(self, validated_data):
        validated_data.pop('password2', None)
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
# map profile.avatar to user serializer field
    avatar = serializers.CharField(
    allow_blank=True,
    required=False
    )

    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "avatar")

    def to_representation(self, instance):
        data = super().to_representation(instance)
        profile = getattr(instance, "profile", None)
        data["avatar"] = getattr(profile, "avatar", "") if profile else ""
        return data

    def validate_email(self, value):
        user = self.instance
        # avoid duplicate email addresses
        if User.objects.filter(email=value).exclude(pk=user.pk).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def update(self, instance, validated_data):
        # pull out avatar if present
        avatar = validated_data.pop("avatar", None)

        # update basic User fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # update/create Profile.avatar
        if avatar is not None:
            profile, _ = Profile.objects.get_or_create(user=instance)
            profile.avatar = avatar
            profile.save()

        return instance