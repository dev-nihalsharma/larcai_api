from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password, ValidationError

User = get_user_model()

class SignupSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, allow_blank=True, max_length=150)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name  = serializers.CharField(required=False, allow_blank=True)
    email      = serializers.EmailField()
    password   = serializers.CharField(write_only=True, min_length=8)

    def validate_username(self, value):
        """Ensure username is unique if provided"""
        if value and User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def validate_email(self, value):
        """Ensure email is unique"""
        if User.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError("Email already exists")
        return value.lower()

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value
