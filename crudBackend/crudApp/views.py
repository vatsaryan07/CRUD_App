from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout,authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import User,Task
from .serializers import UserSerializer,TaskSerializer,RegistrationSerializer
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
import google.generativeai as genai


genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

# Login functionality to create the user
class RegistrationAPIView(APIView):
    
    permission_classes = (AllowAny,)
    serializer_class = RegistrationSerializer

    def post(self, request):
        
        user = request.data
        user['username'] = user['email']
        
        
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
# Listing the users stored on the database    
class UserList(generics.ListAPIView):
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    http_method_names = ['get']

class UserProfile(generics.ListAPIView):
    
    queryset = Task.objects.all()
    serializer_class = UserSerializer
    # user_serl
    
    def get(self,request,*args,**kwargs):
        
        try:
            user = self.request.user
            
            data = self.serializer_class(user)
            print(data['first_name'])
            return Response(data['first_name'].value + ' ' + data['last_name'].value)
        except:

            return Response({ "error":"No User Found" } ,status = status.HTTP_404_NOT_FOUND)

# Preliminary User Create, REDUNDANT
class UserCreate(generics.CreateAPIView):
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    http_method_names = ['post']
    def create(self,request,*args,**kwargs):
        serializer = self.get_serializer(data=request.data,partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        nserializer = RegistrationSerializer.serializer_class(data=self.request.data)
        nserializer.is_valid(raise_exception=True)
        nserializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
# List all tasks in the database
class TaskList(generics.ListAPIView):
    
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get']

# List all tasks for the particular user
class TaskForUser(generics.ListAPIView):
    
    queryset = Task.objects.all()
    serializer_class = UserSerializer
    # user_serl
    
    def get(self,request,*args,**kwargs):
        
        try:
            user = self.request.user
            
            data = self.serializer_class(user)
            print(data['first_name'])
            return Response(data['tasks'].value)
        except:
            return Response({ "error":"No User Found" } ,status = status.HTTP_404_NOT_FOUND)
        
# Create a task for the user (or through superuser)
class TaskCreate(generics.CreateAPIView):
    
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self,request,*args,**kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.request.data.get('user') 
        
        try:
            user = User.objects.get(id=user)
        except User.DoesNotExist:
            return Response({ "error":"No User Found" } ,status = status.HTTP_404_NOT_FOUND)
        
        if user != self.request.user and not self.request.user.is_superuser:
            
            return Response({"error": "You are not authorized to create tasks for others"}, status=status.HTTP_403_FORBIDDEN)
        else:
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=self.headers)
              
# Updating the tasks for the particular user
class TaskUpdate(generics.UpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, *args, **kwargs):
        task_id = request.data['taskid']
        try:
            task = Task.objects.get(taskid=task_id)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

        if task.user == request.user or request.user.is_superuser:
            
            if task.return_owner() != User.objects.get(id=request.data['user']) and not request.user.is_superuser:
                return Response({"error": "You are not authorized to reassign tasks"}, status=status.HTTP_403_FORBIDDEN)
            
            serializer = self.get_serializer(task, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        else:
            return Response({"error": "You are not authorized to update this task"}, status=status.HTTP_403_FORBIDDEN)

# Deleting a particular task associated with a user
class TaskDelete(generics.DestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self,request,*args,**kwargs):
        taskid = request.data['taskid']
        try:
            task = Task.objects.get(taskid = taskid)
        except Task.DoesNotExist:
            return Response({"error":"Task not found"},status=status.HTTP_404_NOT_FOUND)
        
        if task.user == request.user or request.user.is_superuser:
            task.delete()
            return Response({"message": "Task deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"error": "You are not authorized to delete this task"}, status=status.HTTP_403_FORBIDDEN)        
    
class LLMQuery(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    
    def post(self,request,*args,**kwargs):
        try:
            user = self.request.user
            print(self.request)
            init_prompt = """
            I can make four API calls.
            A GET call for yielding the tasks available to the user
            URL : /api/users/tasks/
            No Body

            A POST call for creating the tasks for the user
            URL : /api/tasks/create
            Body : {
                    "taskname": <GIVEN_TASKNAME>,
                    "due_date": <GIVEN_DUE_DATE_IN_ISO_FORMAT>,
                    "priority": <GIVEN_PRIORITY>
                    }

            A PUT call for editing the tasks for the user
            URL : /api/tasks/update
            Body : {
                    "taskname": <GIVEN_TASKNAME>,
                    "due_date": <GIVEN_DUE_DATE_IN_ISO_FORMAT>,
                    "priority": <GIVEN_PRIORITY>
                    }

            A DELETE call for deleting the task associated with the id
            URL : /api/tasks/delete
            Body : {
                    "taskid": <GIVEN_TASK_ID>
                }

            Given this input, decide which call to make and give me the answer as a dict as follows

            {
            url : <CHOSEN_URL>
            body : <BODY>
            }
            Input : 
            """
            prompt = init_prompt + self.request.data['input']
            print(prompt)
            resp = model.generate_content(prompt)
            # print(resp.text)
            return Response({"message":resp.text})
        except:
            return Response({ "error":"No User Found" } ,status = status.HTTP_404_NOT_FOUND)
