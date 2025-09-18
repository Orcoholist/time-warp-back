# Time Warp Backend

A modern, secure NestJS-based REST API providing authentication and user management functionality with JWT token-based authentication.

## 🚀 Features

- **Authentication System**: User registration and login with JWT tokens
- **Password Security**: Bcrypt hashing with salt rounds
- **Request Validation**: Automatic input validation using class-validator
- **CORS Support**: Configurable cross-origin resource sharing
- **Rate Limiting**: Protection against abuse and spam
- **Request Logging**: Comprehensive request/response logging
- **TypeScript**: Full TypeScript support with strong typing
- **Middleware Chain**: Modular middleware architecture

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd time-warp-back
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env  # if example exists
   # Or create .env file with the following variables:
   ```

   ```env
   # Server Configuration
   PORT=3000

   # Security
   JWT_SECRET=your-secure-jwt-secret-key-here

   # CORS Configuration
   CORS_ORIGINS=http://localhost:3001,https://your-frontend-domain.com
   ```

## 🚦 Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

The server will start on `http://localhost:3000` (or the port specified in your environment variables).

## 📚 API Documentation

### Base URL
- Development: `http://localhost:3000`
- Production: (configured via environment variables)

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

### Protected Endpoints
*Require `Authorization: Bearer <token>` header*

#### Get All Users
```http
GET /users
Authorization: Bearer <jwt-token>
```

#### Get User by ID
```http
GET /users/:id
Authorization: Bearer <jwt-token>
```

#### Create User
```http
POST /users/create
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

For detailed API documentation with examples, see [API.md](./API.md).

## 💻 Usage Examples

### Quick Start with cURL

1. **Register a new user:**
   ```bash
   curl -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username": "johndoe", "password": "securePassword123"}'
   ```

2. **Login and get token:**
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username": "johndoe", "password": "securePassword123"}'
   ```

3. **Use the token for protected endpoints:**
   ```bash
   curl -X GET http://localhost:3000/users \
     -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
   ```

For comprehensive examples in multiple programming languages, see [EXAMPLES.md](./EXAMPLES.md).

## 🏗️ Project Structure

```
src/
├── auth/                   # Authentication module
│   ├── auth.controller.ts  # Auth endpoints (register/login)
│   ├── auth.service.ts     # Auth business logic
│   └── auth.module.ts      # Auth module configuration
├── controllers/            # Additional controllers
│   └── users.controller.ts # User management endpoints
├── dto/                    # Data Transfer Objects
│   └── create-user.dto.ts  # User validation schemas
├── middleware/             # Custom middleware
│   ├── auth.middleware.ts  # JWT authentication
│   ├── logger.middleware.ts# Request logging
│   └── rate-limit.middleware.ts # Rate limiting
├── types/                  # Type definitions
├── app.module.ts          # Main application module
├── app.controller.ts      # Default controller
├── app.service.ts         # Default service
└── main.ts               # Application entry point
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage
```bash
npm run test:cov
```

### End-to-End Tests
```bash
npm run test:e2e
```

## 🔧 Development

### Code Formatting
```bash
npm run format
```

### Linting
```bash
npm run lint
```

### Build
```bash
npm run build
```

## 🛡️ Security Features

- **Password Hashing**: Uses bcrypt with 10 salt rounds
- **JWT Tokens**: Secure token-based authentication with 1-week expiration
- **Input Validation**: Automatic request validation with meaningful error messages
- **CORS Protection**: Configurable allowed origins
- **Rate Limiting**: Prevents API abuse
- **Middleware Security**: Layered security approach

## 🔒 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `3000` | No |
| `JWT_SECRET` | JWT signing secret | `default-secret` | **Yes** |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | localhost URLs | No |

⚠️ **Important**: Use a strong, unique `JWT_SECRET` in production!

## 📁 Key Files

- **[src/main.ts](src/main.ts)**: Application bootstrap and configuration
- **[src/app.module.ts](src/app.module.ts)**: Root module with middleware setup
- **[src/auth/auth.service.ts](src/auth/auth.service.ts)**: Core authentication logic
- **[src/auth/auth.controller.ts](src/auth/auth.controller.ts)**: Auth API endpoints
- **[src/middleware/auth.middleware.ts](src/middleware/auth.middleware.ts)**: JWT protection middleware

## 🚧 Production Notes

This is a development/demo implementation with the following considerations for production:

### Current Limitations
- Uses in-memory user storage (not persistent)
- Simplified JWT validation in middleware
- Basic error handling
- No user roles/permissions
- No password strength requirements

### Production Recommendations
1. **Database Integration**: Replace in-memory storage with PostgreSQL/MongoDB
2. **Full JWT Validation**: Implement complete token validation and refresh tokens
3. **Password Requirements**: Add strength validation and complexity rules
4. **User Management**: Add user roles, permissions, and profile management
5. **Logging**: Implement structured logging with Winston or similar
6. **Monitoring**: Add health checks and metrics collection
7. **Security**: Implement additional security measures (helmet.js, etc.)
8. **Testing**: Add comprehensive unit and integration tests
9. **Documentation**: Add Swagger/OpenAPI documentation
10. **Deployment**: Set up CI/CD pipeline and containerization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [UNLICENSED](LICENSE) - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the [API documentation](./API.md)
- Review the [usage examples](./EXAMPLES.md)

## 🎯 Roadmap

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User roles and permissions system
- [ ] Password reset functionality
- [ ] Email verification
- [ ] OAuth integration (Google, GitHub)
- [ ] API rate limiting per user
- [ ] Swagger/OpenAPI documentation
- [ ] Docker containerization
- [ ] Comprehensive test suite
- [ ] Production deployment guides