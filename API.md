# Time Warp Backend API Documentation

## Overview

The Time Warp Backend is a NestJS-based REST API that provides authentication and user management functionality. The API follows RESTful conventions and uses JWT tokens for authentication.

## Base URL

- Development: `http://localhost:3000`
- Production: (configured via environment variables)

## Authentication

The API uses JWT (JSON Web Token) based authentication. After successful login or registration, clients receive an access token that must be included in subsequent requests.

### Authentication Header Format
```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request` - Missing or invalid fields
- `409 Conflict` - Username already exists (if implemented)

#### POST /auth/login
Authenticate an existing user.

**Request Body:**
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request` - Missing or invalid fields
- `401 Unauthorized` - Invalid credentials

### User Management Endpoints

*Note: All user management endpoints require authentication*

#### GET /users
Retrieve all users in the system.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "users": ["User1", "User2"]
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token

#### GET /users/:id
Retrieve a specific user by ID.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `id` (path parameter) - User ID

**Response (200 OK):**
```json
{
  "user": "ID 123"
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - User not found (if implemented)

#### POST /users/create
Create a new user (admin operation).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "user": {
    "username": "new_user",
    "password": "securePassword123"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing or invalid fields
- `401 Unauthorized` - Missing or invalid token

## Data Models

### User
```typescript
interface User {
  id?: number;
  username: string;
  password: string; // Only used internally, never returned in responses
}
```

### CreateUserDto
```typescript
class CreateUserDto {
  username: string; // Required, non-empty string
  password: string; // Required, non-empty string
}
```

### JwtPayload
```typescript
interface JwtPayload {
  username: string;
  id?: number;
}
```

## Error Handling

The API returns consistent error responses in the following format:

```json
{
  "message": "Error description",
  "error": "Error type",
  "statusCode": 400
}
```

### Common Error Codes

- `400 Bad Request` - Invalid request data or missing required fields
- `401 Unauthorized` - Authentication required or invalid credentials
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with 10 salt rounds
2. **JWT Tokens**: Access tokens expire after 1 week
3. **Input Validation**: All request data is validated using class-validator
4. **CORS**: Cross-origin requests are restricted to configured domains
5. **Rate Limiting**: Requests are rate-limited to prevent abuse
6. **Request Logging**: All requests are logged for monitoring

## Usage Examples

### Registration Example
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securePassword123"
  }'
```

### Login Example
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securePassword123"
  }'
```

### Authenticated Request Example
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Environment Variables

Configure the following environment variables:

```env
# Server Configuration
PORT=3000

# Security
JWT_SECRET=your-secure-jwt-secret-key

# CORS Configuration
CORS_ORIGINS=http://localhost:3001,https://your-frontend-domain.com
```

## Development Notes

1. **In-Memory Storage**: The current implementation uses in-memory storage for users. For production, integrate with a persistent database.

2. **JWT Token Validation**: The authentication middleware currently only checks for token presence. Full JWT validation should be implemented for production use.

3. **Password Requirements**: Consider implementing password strength requirements for better security.

4. **User Validation**: Add unique username validation to prevent duplicate registrations.

5. **Error Handling**: Implement comprehensive error handling and logging for production environments.

## Production Recommendations

1. Replace in-memory storage with a persistent database (PostgreSQL, MongoDB, etc.)
2. Implement full JWT token validation and refresh token mechanism
3. Add password strength requirements and validation
4. Implement user roles and permissions
5. Add comprehensive logging and monitoring
6. Set up proper environment-specific configuration
7. Implement API rate limiting per user/IP
8. Add API documentation with Swagger/OpenAPI
9. Implement proper error handling and user-friendly error messages
10. Add unit and integration tests