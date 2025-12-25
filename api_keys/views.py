from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response



from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, PermissionDenied
from .models import UserAPIKey
from .serializers import UserAPIKeyListSerializer

class UserAPIKeyListCreateView(generics.ListCreateAPIView):
    """
    GET  -> list current user's active keys
    POST -> create a new key for the authenticated user and return the raw key once
    """
    serializer_class = UserAPIKeyListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserAPIKey.objects.filter(owner=self.request.user, revoked=False)

    def perform_create(self, serializer):
        # We override to use the package helper create_api_key which returns (obj, key)
        name = self.request.data.get("name", "")
        obj, raw_key = UserAPIKey.objects.create_key(name=name, owner=self.request.user)
        # attach created object and raw key so create() can return it
        self._created_obj = obj
        self._raw_key = raw_key

    def create(self, request, *args, **kwargs):
        # call perform_create via super to create object
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # use serializer to produce listable data without revealing secret
        out_serializer = self.get_serializer(self._created_obj)
        data = out_serializer.data
        # include the raw key only in this response (show once)
        data["key"] = getattr(self, "_raw_key", None)
        headers = self.get_success_headers(out_serializer.data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)


class UserAPIKeyRevokeView(generics.DestroyAPIView):
    """
    Soft revoke (delete) an API key belonging to the user.
    Uses the key's PK in the URL.
    """
    serializer_class = UserAPIKeyListSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "pk"

    def get_queryset(self):
        return UserAPIKey.objects.filter(owner=self.request.user)

    def perform_destroy(self, instance):
        # package provides instance.revoke() or we can set revoked
        # prefer the package's revoke method if available:
        try:
            instance.revoke(save=True)
        except AttributeError:
            instance.revoked = True
            instance.save(update_fields=["revoked"])
