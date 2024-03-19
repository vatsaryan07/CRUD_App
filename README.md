## Task Manager - AI-powered CRUD App with REST API

This project implements a to-do list application with AI capabilities to manage your daily tasks. It provides a user interface and exposes a RESTful API for CRUD operations on tasks.

### Features

* **User Management:**
    * Create an account
    * Login with email and password (JWT token based authentication)
    * View user profile
* **Task Management:**
    * Create new tasks
    * Edit existing tasks
    * Delete tasks
* **LLMQuery:**
    * Query the chatbot for assistance

### Authentication

* All API endpoints require user authentication.
* A stateless JWT token is used for authentication.
* Only the creator of a task can edit or delete it.

### Getting Started

#### How to Use

1. Add your Google API key to the `views.py` file in the `crudApp` folder.
2. Run `npm install` in the `crudfrontend` folder.
3. Create a Conda environment (or any virtual environment) in `crudBackend` using the `requirements.txt`.
4. Run the server using `python manage.py runserver`.
5. Run the frontend using `npm start`.

#### Docker

1. Add your Google API key to the 'views.py' file in the 'crudApp' folder.
2. Navigate to the main directory and run 'docker-compose build'.
3. Run the 'docker-compose up -d' to start the docker container.

### API Documentation

The application exposes a RESTful API for managing tasks. Here's an overview of the endpoints:

| Endpoint | Method | Description |
|---|---|---|
| /users/ | GET | View all user accounts |
| /users/create | POST | Create a new user account |
| /users/view | GET | View user profile |
| /users/tasks/ | GET | View user tasks |
| /login | POST | Login with email and password (returns JWT token) |
| /tasks/ | GET | Fetch all the tasks |
| /tasks/create | POST | Create a new task |
| /tasks/update | PUT | Edit details of a specific task |
| /tasks/delete | DELETE | Delete a task |
| /llmquery | POST | Query the chatbot |

**Request/Response Format:**

* Requests and responses are expected in JSON format.

**Authentication:**

* Include the JWT token in the Authorization header of all requests except for `/users`, `/login`, `/users/view`, and `/llmquery`.

**Authorization:**

* Only the creator of a task can edit or delete it.
