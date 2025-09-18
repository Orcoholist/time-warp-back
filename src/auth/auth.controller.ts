/**
 * Authentication Controller
 *
 * Handles HTTP requests for user authentication operations including
 * user registration and login. This controller provides RESTful endpoints
 * for client applications to authenticate users.
 *
 * Base route: /auth
 *
 * Available endpoints:
 * - POST /auth/register - User registration
 * - POST /auth/login - User authentication
 *
 * All endpoints include automatic request validation and transformation
 * using NestJS ValidationPipe and class-validator decorators.
 */

import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService, User } from './auth.service';
import { CreateUserDto } from '../dto/create-user.dto';

/**
 * Authentication controller handling user registration and login
 *
 * This controller serves as the entry point for all authentication-related
 * HTTP requests, delegating business logic to the AuthService.
 */
@Controller('auth')
export class AuthController {
  /**
   * Inject AuthService dependency for handling authentication logic
   *
   * @param authService - Service containing authentication business logic
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Register new user account
   *
   * Creates a new user account with the provided credentials.
   * The password is automatically hashed for security before storage.
   *
   * @route POST /auth/register
   * @param createUserDto - User registration data (validated automatically)
   * @returns Promise containing user object (without password) and JWT access token
   *
   * @example
   * POST /auth/register
   * Body: { "username": "john_doe", "password": "securePassword123" }
   * Response: {
   *   "user": { "id": 1, "username": "john_doe" },
   *   "accessToken": "eyJhbGciOiJIUzI1NiIs..."
   * }
   */
  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async register(@Body() createUserDto: CreateUserDto): Promise<{
    user: Omit<User, 'password'>;
    accessToken: string;
  }> {
    return this.authService.register(createUserDto);
  }

  /**
   * Authenticate existing user
   *
   * Validates user credentials and returns a JWT access token for
   * authenticated sessions. Supports case-insensitive username matching.
   *
   * @route POST /auth/login
   * @param createUserDto - User login credentials (validated automatically)
   * @returns Promise containing user object (without password) and JWT access token
   *
   * @example
   * POST /auth/login
   * Body: { "username": "john_doe", "password": "securePassword123" }
   * Response: {
   *   "user": { "id": 1, "username": "john_doe" },
   *   "accessToken": "eyJhbGciOiJIUzI1NiIs..."
   * }
   */
  @Post('login')
  @UsePipes(
    new ValidationPipe({
      whitelist: true, // Remove unknown properties
      forbidNonWhitelisted: false, // Allow additional properties (flexible login)
      transform: true, // Transform incoming data to DTO instances
    }),
  )
  async login(@Body() createUserDto: CreateUserDto) {
    return this.authService.login(createUserDto);
  }
}
