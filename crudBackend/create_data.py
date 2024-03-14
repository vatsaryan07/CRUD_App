from crudApp.models import User


User.objects.create('user1@example.com', 1,'John', 'Doe', 'password1', 'token1')
User.objects.create('user2@example.com', 2,'Jane', 'Smith', 'password2', 'token2')