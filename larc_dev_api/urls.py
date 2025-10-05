
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView,TokenVerifyView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('agents/', include('agents.urls')),
    path('subscriptions/', include('subscriptions.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/',TokenVerifyView.as_view(),name='token_verify'),
    #oauth endpoint
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
]
