from rest_framework import authentication, exceptions
from django.contrib.auth import get_user_model
from .models import UserAPIKey

User = get_user_model()


class APIKeyAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        # =====================================================
        # 1. Extract API key from headers
        # =====================================================
        key = request.META.get("HTTP_X_API_KEY") or request.headers.get("X-API-KEY")
        if not key:
            return None  # Let other auth methods try

        try:
            # =====================================================
            # 2. Fetch API key from YOUR custom model
            # =====================================================
            api_key_obj = UserAPIKey.objects.get_from_key(key)

            # =====================================================
            # 3. Expiry check
            # =====================================================
            if api_key_obj.has_expired:
                raise exceptions.AuthenticationFailed("API Key has expired.")

            # =====================================================
            # 4. Resolve user directly from key
            # =====================================================
            user = api_key_obj.owner

            if not user or not user.is_active:
                raise exceptions.AuthenticationFailed("User is inactive or does not exist.")

            # =====================================================
            # 5. Success
            # =====================================================
            return (user, None)

        except UserAPIKey.DoesNotExist:
            # Key structure valid, but not found
            raise exceptions.AuthenticationFailed("Invalid API Key.")

        except Exception:
            # Malformed / tampered key
            raise exceptions.AuthenticationFailed("Invalid API Key format.")
