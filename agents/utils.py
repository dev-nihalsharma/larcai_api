from django.http import HttpRequest, JsonResponse

def verify_api_key(request):
    
    api_key=request.headers.get("X-API-KEY")
    if(not api_key or api_key != "expected_api_key_value"):
        return JsonResponse({"error": "Invalid or missing API key"}, status=401)
    