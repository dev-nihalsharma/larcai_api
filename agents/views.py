from rest_framework import viewsets
from rest_framework.decorators import action

from larc_dev_api.utils import resp_success


# Create your views here.
class ChatBotViewSet(viewsets.ModelViewSet):

    @action(detail=False, methods=['post'])
    def chat(self, request):

        # Implement your chat logic here
        return resp_success(data={"message": "Chat response"}, code=200)
