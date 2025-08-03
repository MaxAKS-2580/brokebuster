from django.urls import path
from . import views

urlpatterns = [
    path('ping/', views.ping_view, name='ping'),
    path('demo/', views.demo_view, name='demo'),
    path('health/', views.health_check, name='health'),
]
