from django.contrib import admin
from .models import UserUsage

@admin.register(UserUsage)
class UserUsageAdmin(admin.ModelAdmin):
    list_display = ('user', 'credits_balance')
    search_fields = ('user__email', 'user__username')
