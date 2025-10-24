from rest_framework import serializers
from .models import UserAPIKey

class UserAPIKeyListSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAPIKey
        fields = ["id", "name", "created", "revoked"]
        read_only_fields = ["id", "created", "revoked"]