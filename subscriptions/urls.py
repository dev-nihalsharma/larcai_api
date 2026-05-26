from django.urls import path
from .views import buy_credits,get_billing_dashboard, credit_success_callback

urlpatterns = [
    path('buy_credits/', buy_credits, name='buy_credits'),
    path('success/', credit_success_callback, name='credit_success'),
    path('dashboard/', get_billing_dashboard, name='billing-dashboard'),
]