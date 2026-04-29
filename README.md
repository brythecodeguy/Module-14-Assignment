# Module 13

## Module Overview

This module builds on the FastAPI application by adding a complete full-stack experience, including a frontend interface, JWT-based authentication, database integration, Docker deployment, and full test coverage.

The system allows users to register, log in, and perform calculations through a user-friendly interface. All calculations are stored in a PostgreSQL database and are tied to the authenticated user. Protected routes require JWT authentication using OAuth2.

---

## Frontend Interface

A simple frontend was implemented using HTML, CSS, and JavaScript to interact with the FastAPI backend.

### Features

- Login and registration pages  
- Dashboard for performing calculations  
- Dynamic UI updates based on user actions  
- Error and success message handling  
- Button-based calculation system  

The frontend communicates with the backend using `fetch` requests and handles authentication using JWT tokens.

---

## Docker Setup

The FastAPI application runs using Uvicorn inside the container:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

To start the application:

```bash
docker compose up --build
```

This starts:

- FastAPI application  
- PostgreSQL database  
- pgAdmin interface  

---

## Docker Hub Repository

<https://hub.docker.com/r/bry633/module-12-assignment>

---

## Access Application

FastAPI (Swagger UI):  
<http://localhost:8000/docs>  

Frontend Pages:  

- <http://localhost:8000/login>  
- <http://localhost:8000/register>  
- <http://localhost:8000/dashboard>  

pgAdmin:  
<http://localhost:5050>  

Login:

- Email: <admin@example.com>  
- Password: admin  

---

## Database Connection

- Host: db  
- Username: postgres  
- Password: postgres  
- Database: fastapi_db  

---

## Authentication System

JWT-based authentication is implemented using OAuth2 Password Flow.

### User Registration

Users register with:

- first_name  
- last_name  
- email  
- username  
- password  
- confirm_password  

Passwords are securely hashed using bcrypt.

---

### User Login

- Login with username and password  
- Returns:
  - access_token  
  - refresh_token  
- JWT tokens are stored in localStorage after login  
- Tokens are included in the Authorization header for protected requests  

---

### Authorization (Swagger UI)

1. Register a user  
2. Login to receive credentials  
3. Click **Authorize** in Swagger  
4. Enter username + password  
5. Swagger automatically attaches JWT token  

---

## Protected API Endpoints

All calculation endpoints require authentication.

### Create Calculation

POST `/calculations`

Example:

```json
{
  "a": 10,
  "b": 5,
  "type": "addition"
}
```

Response:

```json
{
  "result": 15
}
```

---

### Get Calculations

GET `/calculations`

Returns all calculations for the authenticated user.

---

## Calculation System

Supports the following operations:

- Addition  
- Subtraction  
- Multiplication  
- Division  

---

## System Features

- Input validation  
- Error handling (e.g., division by zero)  
- User-specific data storage  
- Results persisted in database  

---

## Testing

Run tests:

```bash
pytest --run-slow --cov=app --cov-fail-under=100
```

Includes:

- Unit tests  
- Integration tests  
- API endpoint tests  
- Authentication tests  
- Database tests  
- Frontend route tests  

Results:

- 189 tests passing  
- 100% code coverage  

---

## CI/CD Pipeline

GitHub Actions pipeline includes:

1. Run tests  
2. Enforce 100% coverage  
3. Security scan using Trivy  
4. Build Docker image  
5. Push to Docker Hub  

---

## Security

- Password hashing with bcrypt  
- JWT authentication  
- OAuth2 password flow  
- Protected API routes  
- Secure token handling (localStorage + Authorization header)  
- Dependency vulnerability scanning (Trivy)  
- Fixed critical vulnerability:
  - python-multipart upgraded to secure version  

---

## Docker Image

Includes:

- FastAPI application  
- PostgreSQL database integration  
- Frontend interface  
- Secure dependencies  
- Production-ready configuration  

---

## Reflection

Reflection on experience with this module:

- [Module13_Reflection.pdf](./Module13_Reflection.pdf) – Reflection  

---

## Summary

This project brings together frontend development, backend logic, authentication, database integration, testing, and deployment into a complete full-stack application. It demonstrates how modern web systems are built, secured, tested, and deployed using industry-relevant tools and practices.
