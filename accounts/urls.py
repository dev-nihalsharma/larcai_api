from django.urls import path
from accounts.views import AuthViewSet

urlpatterns = [
    path('login/', AuthViewSet.as_view({'post': 'login'}), name='login'),
]
