from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, PermissionDenied
from .models import UserAPIKey
from .serializers import UserAPIKeyListSerializer


class UserAPIKeyListCreateView(generics.ListCreateAPIView):
    """
    GET  -> List current user's active API keys.
    POST -> Create a new API key for the authenticated user and return the raw key once.
    """
    serializer_class = UserAPIKeyListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only list active, non-revoked keys belonging to the current user
        return UserAPIKey.objects.filter(owner=self.request.user, revoked=False)

    def perform_create(self, serializer):
        # Use the built-in helper to generate a secure hashed key + return its raw value once
        name = self.request.data.get("name", "")
        obj, raw_key = UserAPIKey.objects.create_key(name=name, owner=self.request.user)
        self._created_obj = obj
        self._raw_key = raw_key

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        out_serializer = self.get_serializer(self._created_obj)
        data = out_serializer.data
        # The raw key (only shown once, never stored in DB)
        data["key"] = getattr(self, "_raw_key", None)

        headers = self.get_success_headers(out_serializer.data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)


class UserAPIKeyRevokeView(generics.DestroyAPIView):
    """
    DELETE -> Soft revoke an API key belonging to the user using its PK.
    """
    serializer_class = UserAPIKeyListSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "pk"

    def get_queryset(self):
        return UserAPIKey.objects.filter(owner=self.request.user)

    def perform_destroy(self, instance):
        # Official APIKey class has .revoke() built in
        instance.revoke(save=True)

# Create your views here.
