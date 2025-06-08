# users/views.py

from rest_framework import viewsets
from .models import Profile, QuizAttempt
from .serializers import ProfileSerializer, QuizAttemptSerializer

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all().order_by('id')  # Agregamos orden
    serializer_class = ProfileSerializer

class QuizAttemptViewSet(viewsets.ModelViewSet):
    queryset = QuizAttempt.objects.all().order_by('id')  # Agregamos orden
    serializer_class = QuizAttemptSerializer
