# from django.db import models
# import uuid
# import jwt

# from datetime import datetime, timedelta

# from django.conf import settings
# from django.contrib.auth.models import (
#     AbstractBaseUser, BaseUserManager, PermissionsMixin
# )
# from django.db import models

# class User(models.Model):
#     email = models.EmailField(unique=True,blank=False)
#     userid = models.IntegerField(primary_key = True)
#     first_name = models.CharField(max_length=100,blank=False)
#     last_name = models.CharField(max_length=100,blank=False)
#     password = models.CharField(max_length=100,blank=False)
#     access_token = models.CharField(max_length=100, blank=False, null=False)
#     # print("ACCESS TOKEN PRINTED")
#     def token(self):
#         print("TOKEN CALLED")
#         return self._generate_jwt_token()
    
#     def __str__(self):
#         return self.email
    
#     def _generate_jwt_token(self):



from django.db import models
import uuid
import jwt

from datetime import datetime, timedelta

from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, PermissionsMixin,AbstractUser
)
from django.db import models


class UserManager(BaseUserManager):
    """
    Custom User Manager class for login and superuser
    definitions
    """

    def create_user(self, username, email, first_name,last_name,password=None):
        user = self.model(username=username, email=self.normalize_email(email),first_name = first_name,last_name = last_name)
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, username, email,first_name,last_name, password):
        user = self.create_user(username, email,first_name,last_name, password)
        user.is_superuser = True
        user.is_staff = True
        user.save()

        return user


# User class with the database setup
class User(AbstractUser,PermissionsMixin):
    objects = UserManager()
    email = models.EmailField(unique=True,blank=False)
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length = 100,blank = False,unique=True)
    first_name = models.CharField(max_length=100,blank=False)
    last_name = models.CharField(max_length=100,blank=False)
    password = models.CharField(max_length=100,blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username','first_name','last_name']
    
    @property
    def token(self):
        return self._generate_jwt_token()
    
    def __str__(self):
        return self.email
    
    def _generate_jwt_token(self):
        dt = datetime.now() + timedelta(days=60)

        token = jwt.encode({
            'id': self.pk,
            'exp': dt.utcfromtimestamp(dt.timestamp()) 
        }, settings.SECRET_KEY, algorithm='HS256')
        return token.decode('utf-8')
        
    def return_tasks(self):
        # print(UserSeri)
        return self.tasks
    

# Task class with the database setup
class Task(models.Model):
    taskname = models.TextField(blank=False)
    taskid = models.IntegerField(primary_key = True)
    user = models.ForeignKey('crudApp.User',related_name = "tasks", on_delete=models.CASCADE,default = 0)
    due_date = models.DateTimeField(blank=False)
    priority = models.IntegerField(blank=False)

    def __str__(self):
        return self.taskname
    
    def return_id(self):
        return self.taskid 
    
    def return_owner(self):
        return self.user 

