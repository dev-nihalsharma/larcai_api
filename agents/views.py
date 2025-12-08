from rest_framework import viewsets
from rest_framework.decorators import action

from larc_dev_api.utils import resp_success
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_api_key.permissions import HasAPIKey


# Create your views here.
class ChatBotViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAuthenticated, HasAPIKey]

    @action(detail=False, methods=['post'])
    def chat(self, request):

        # Implement your chat logic here
        return resp_success(data={"message": "Chat response"}, code=200)
