
from django.contrib.auth import authenticate, login
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiResponse
from django.contrib.auth import get_user_model

from .serializers import SignupSerializer
from .utils import build_response

User = get_user_model()

class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        request=SignupSerializer,
        responses={
            201: OpenApiResponse(description="User created"),
            400: OpenApiResponse(description="Validation errors"),
        },
    )
    def post(self, request):
        serializer = SignupSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                build_response(False, "Validation failed", errors=serializer.errors),
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = serializer.validated_data

        user = User.objects.create_user(
            email=data["email"],
            password=data["password"],
            username=(data.get("username") or None),
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
        )

        return Response(
            build_response(
                True,
                "Account created",
                data={
                    "id": user.id,
                    "email": user.email,
                    "username": user.username,
                },
            ),
            status=status.HTTP_201_CREATED,
        )

class AuthViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)

        if user is not None:
            login(request, user)
            return Response({
                'success': True,
                'message': 'Logged in successfully.'
            })
        else:
            return Response({
                'success': False,
                'message': 'Invalid credentials.'
            }, status=status.HTTP_400_BAD_REQUEST)
