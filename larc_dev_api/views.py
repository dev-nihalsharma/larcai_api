from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_api_key.permissions import HasAPIKey
from drf_spectacular.utils import extend_schema
@extend_schema(security=[{"ApiKeyAuth": []}],description="Protected data view")
class ProtectedDataView(APIView):
    authentication_classes = []
    permission_classes = [HasAPIKey]  # Only valid API key can access

    def get(self, request):
        return Response({"message": "You accessed a protected endpoint with API key!"})
