
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from larc_dev_api.views import MyTokenObtainPairView
urlpatterns = [
    path('v1/admin/', admin.site.urls),
    path('v1/account/', include('accounts.urls')),
    path('v1/accounts/', include('allauth.urls')),
    path('v1/agents/', include('agents.urls')),
    path('v1/subscriptions/', include('subscriptions.urls')),
    path('v1/api-keys/', include('api_keys.urls')),
    path("v1/token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path('v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('v1/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    # oauth endpoint
    path('v1/o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    path("v1/schema/", SpectacularAPIView.as_view(), name="schema"),
    path('v1/docs/', SpectacularSwaggerView.as_view(url_name="schema"),
         name="swagger-ui"),
    path('v1/redoc/', SpectacularRedocView.as_view(url_name="redoc"), name="redoc"),
]
