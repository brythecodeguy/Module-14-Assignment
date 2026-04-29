# Module 14

## Module Overview

This module extends the FastAPI application into a complete full-stack system by implementing BREAD functionality (Browse, Read, Edit, Add, Delete), enhanced frontend pages, JWT-based authentication, database integration, Docker deployment, and full test coverage.

The system allows users to register, log in, and manage calculations through an interactive frontend. All calculations are stored in a PostgreSQL database and are tied to the authenticated user. Protected routes require JWT authentication using OAuth2.

---

## Frontend Interface

The frontend was expanded using HTML, CSS, and JavaScript to provide a more complete user experience.

### Features

- Login and registration pages  
- Dashboard for performing calculations  
- View Calculation page (Read)  
- Edit Calculation page (Update)  
- Delete functionality with confirmation  
- Dynamic UI updates based on user actions  
- Error and success message handling  
- Styled UI with improved layout and user flow  

The frontend communicates with the backend using `fetch` requests and handles authentication using JWT tokens.

---

## BREAD Functionality

The application now fully supports:

- **Browse** – View all user calculations in the dashboard  
- **Read** – View a specific calculation with detailed information  
- **Edit** – Update calculation inputs and type  
- **Add** – Create new calculations  
- **Delete** – Remove calculations from the database  

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

<https://hub.docker.com/r/bry633/module-14-assignment>

---

## Access Application

FastAPI (Swagger UI):  
<http://localhost:8000/docs>  

Frontend Pages:

- <http://localhost:8000/login>  
- <http://localhost:8000/register>  
- <http://localhost:8000/dashboard>  
- <http://localhost:8000/dashboard/view/{id}>  
- <http://localhost:8000/dashboard/edit/{id}>  

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

### Update Calculation

PUT `/calculations/{id}`

Updates calculation inputs and type.

---

### Delete Calculation

DELETE `/calculations/{id}`

Removes a calculation from the database.

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
- Full BREAD functionality  
- Improved frontend UX  

---

## Testing

Run tests:

```bash
python -m pytest --cov=app --cov-fail-under=100
```

Includes:

- Unit tests  
- Integration tests  
- API endpoint tests  
- Authentication tests  
- Database tests  
- Frontend route tests  
- Playwright End-to-End (E2E) tests  

### E2E Test Coverage

- Positive scenarios:
  - Create calculation  
  - View calculation  
  - Edit calculation  
  - Delete calculation  

- Negative scenarios:
  - Invalid input (e.g., division by zero)  
  - Unauthorized access (redirect to login)  

---

## Results

- 185 tests passing  
- 1 skipped  
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

- [Module14_Reflection.pdf](./Module14_Reflection.pdf) – Reflection
- [Module14_Screenshots.pdf](./Module14_Screenshots.pdf) – Screenshots

---

## Summary

This module completes the full-stack FastAPI application by integrating frontend development, backend logic, authentication, database operations, BREAD functionality, testing, and deployment. It demonstrates how many applications are built, secured, tested, and deployed using industry relevant tools and practices.
