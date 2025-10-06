from django.conf import settings
from django.db import models
from rest_framework_simple_api_key.models import AbstractAPIKey

User = settings.AUTH_USER_MODEL


class UserAPIKey(AbstractAPIKey):
    # Use a unique related_name to avoid clashes with the upstream package
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_api_keys')

    # Redeclare entity with a different related_name to avoid reverse accessor clashes
    entity = models.ForeignKey(
        User, on_delete=models.CASCADE,null=True,blank=True,related_name='entity_api_keys'
    )

    class Meta:
        verbose_name="User API Key"
        verbose_name_plural="User API Keys"

    def __str__(self):
        return f"{self.owner}-{self.name}"
    