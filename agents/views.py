from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny

from agents.ai_agent.ai_agent import langgraph_pipeline
from larc_dev_api.utils import resp_success
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_api_key.permissions import HasAPIKey


# Create your views here.
class ChatBotViewSet(viewsets.ViewSet):

    permission_classes = [AllowAny]

    # @action(detail=False, methods=['post'])
    def create(self, request):

        # apikey objects required as of now hardcoded for testing
        # Step 1: Verify API Key
        # invalid= verify_api_key(request)
        # if invalid:
        #     return resp_fail("error",data={"message": "Invalid API Key"}, code=401)
        permission_classes = [IsAuthenticated]
        auto_mode = request.query_params.get("auto","false").lower()=="true"
        client_thread_id = request.data.get("thread_id", None)
        selected_model=request.data.get("model",None)
        if auto_mode:
            final_mode=None
        else:
            final_mode=selected_model
        data = {
            "prompt": request.data.get("prompt", ""),
            "model": final_mode,
        }

        output = langgraph_pipeline(data, thread_id=client_thread_id)
        
        result_state = output["result"]
        new_thread_id = output["thread_id"]
        
        # Safe access to response
        messages = result_state.get("messages", [])
        ai_message = messages[-1]["content"] if messages else ""

        return resp_success("success", data={
            "response": ai_message,
            "thread_id": new_thread_id,
            "full_state": result_state
        }, code=200)
