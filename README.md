## Task Manager - AI-powered CRUD App with REST API

This project implements a to-do list application with AI capabilities to manage your daily tasks. It provides a user interface and exposes a RESTful API for CRUD operations on tasks.

### Features

* **User Management:**
    * Create an account
    * Login with email and password (JWT token based authentication)
* **Task Management:**
    * Create new tasks
    * Edit existing tasks
    * Delete tasks

### Authentication

* All API endpoints require user authentication.
* A stateless JWT token is used for authentication.
* Only the creator of a task can edit or delete it.

### Getting Started

### API Documentation

The application exposes a RESTful API for managing tasks. Here's an overview of the endpoints:

| Endpoint | Method | Description |
|---|---|---|
| /users/ | GET | View all user accounts |
| /users/create | POST | Create a new user account |
| /users/tasks/ | GET | View user tasks |
| /login | POST | Login with email and password (returns JWT token) |
| /tasks/ | GET | Fetch all the tasks |
| /tasks/create | POST | Create a new task |
| /tasks/update | PUT | Edit details of a specific task |
| /tasks/delete | DELETE | Delete a task |

**Request/Response Format:**

* Requests and responses are expected in JSON format.

**Authentication:**

* Include the JWT token in the Authorization header of all requests except for `/users` and `/login`.

**Authorization:**

* Only the creator of a task can edit or delete it.
