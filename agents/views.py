from rest_framework import viewsets
from rest_framework.decorators import action
from .utils import verify_api_key
from larc_dev_api.utils import resp_success, resp_fail
from .ai_agent.ai_agent import langgraph_pipeline
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class ChatBotViewSet(viewsets.ModelViewSet):

    @action(detail=False, methods=['post'])
    def chat(self, request):

        # apikey objects required as of now hardcoded for testing
        # Step 1: Verify API Key
        # invalid= verify_api_key(request)
        # if invalid:
        #     return resp_fail("error",data={"message": "Invalid API Key"}, code=401)
        permission_classes = [IsAuthenticated]
        data = {
            "prompt": request.data.get("prompt", ""),
            "model": request.data.get("model", None),
            "response":None
        }

        result = langgraph_pipeline(data)
        print("Response from langgraph_pipeline:", result)
        # Step 3: Return response

        return resp_success("success",data={"message": result}, code=200)
    