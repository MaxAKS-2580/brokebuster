import os
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def ping_view(request):
    """
    Simple ping endpoint that returns a message from environment or default
    """
    ping_message = os.getenv('PING_MESSAGE', 'pong')
    return Response({'message': ping_message})

@api_view(['GET'])
def demo_view(request):
    """
    Demo endpoint similar to the Express server
    """
    return Response({
        'message': 'Hello from Django!',
        'timestamp': '2024-01-01T00:00:00Z',
        'data': {
            'framework': 'Django',
            'version': '4.2.7',
            'api': 'REST'
        }
    })

@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint
    """
    return Response({
        'status': 'healthy',
        'service': 'curry-world-django-backend',
        'version': '1.0.0'
    })
