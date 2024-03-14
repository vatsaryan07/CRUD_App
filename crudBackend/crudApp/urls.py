from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.UserList.as_view(), name='user-list'),
    path('users/create', views.RegistrationAPIView.as_view(), name='user-create'),
    path('users/tasks/', views.TaskForUser.as_view(), name='user-tasks'),
    path('tasks/', views.TaskList.as_view(), name='task-list'),
    path('tasks/create', views.TaskCreate.as_view(), name='task-create'),
    path('tasks/update', views.TaskUpdate.as_view(), name='task-update'),
    path('tasks/delete', views.TaskDelete.as_view(), name='task-delete'),
    path('register', views.RegistrationAPIView.as_view(), name='register'),
]
