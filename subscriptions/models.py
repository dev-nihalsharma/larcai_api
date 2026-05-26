# subscriptions/models.py
from django.db import models
from django.conf import settings
import uuid

class UserUsage(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='usage_profile')
    credits_balance = models.DecimalField(max_digits=10, decimal_places=2, default=10.00)

class Transaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    order_id = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    credits = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default="PENDING") 
    created_at = models.DateTimeField(auto_now_add=True)