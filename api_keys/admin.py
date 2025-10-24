from django.contrib import admin
from .models import UserAPIKey

@admin.register(UserAPIKey)
class UserAPIKeyAdmin(admin.ModelAdmin):
    list_display = ('owner', 'name', 'created', 'revoked')
    search_fields = ('owner__username', 'name')
    readonly_fields = ('created',)

# Register your models here.
