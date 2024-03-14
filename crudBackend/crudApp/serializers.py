from rest_framework import serializers
from .models import User, Task

# Task serializer for easy use
class TaskSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Task
        fields = ['taskname', 'taskid', 'user', 'due_date', 'priority']#, 'assigned_user']

# User serializer for easy use
class UserSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many = True)
    class Meta:
        model = User
        fields = ['email', 'id', 'first_name', 'last_name','tasks','token']

# Registration serializer for user registration
class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True
    )

    
    token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = User
        
        fields = ['email', 'username','first_name','last_name', 'password', 'token']

    def create(self, validated_data):
        
        return User.objects.create_user(**validated_data)