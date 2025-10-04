
from django.contrib.auth import authenticate, login
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny


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
