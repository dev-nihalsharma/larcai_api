from django.conf import settings
from django.db import models
from rest_framework_api_key.models import AbstractAPIKey  

User = settings.AUTH_USER_MODEL


class UserAPIKey(AbstractAPIKey):
    """
    API key linked to a specific user and optionally another user (entity).
    Works with djangorestframework-api-key.
    """

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="user_api_keys",
        help_text="The user who owns this API key.",
    )

    entity = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="entity_api_keys",
        help_text="Optional secondary user or entity related to this API key.",
    )

    class Meta(AbstractAPIKey.Meta):
        verbose_name = "User API Key"
        verbose_name_plural = "User API Keys"

    def __str__(self):
        return f"{self.owner} - {self.name}"

# Create your models here.
