from django.urls import path
from accounts.views import AuthViewSet
from accounts.views import RegisterAPIView
urlpatterns = [
    path('login/', AuthViewSet.as_view({'post': 'login'}), name='login'),
    path('signup/', RegisterAPIView.as_view(), name='signup'),
]
