from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, QuizAttempt

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ProfileSerializer(serializers.ModelSerializer):
    # Cambiar para que acepte el ID al crear
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Profile
        fields = ['user', 'bio', 'avatar', 'created_at']

class QuizAttemptSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = QuizAttempt
        fields = ['user', 'quiz', 'score', 'max_score', 'completed_at']
