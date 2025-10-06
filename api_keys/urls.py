from django.urls import path
from .views import UserAPIKeyListCreateView, UserAPIKeyRevokeView

urlpatterns = [
    path("api-keys/", UserAPIKeyListCreateView.as_view(), name="api_key_list_create"),
    path("api-keys/<int:pk>/", UserAPIKeyRevokeView.as_view(), name="api_key_revoke"),
]
