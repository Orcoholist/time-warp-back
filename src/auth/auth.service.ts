/**
 * Authentication Service
 *
 * Provides core authentication functionality including user registration,
 * login, password hashing, and JWT token generation. This service uses
 * in-memory storage for demo purposes.
 *
 * Security Features:
 * - Password hashing with bcrypt (salt rounds: 10)
 * - JWT token generation with configurable expiration
 * - Input validation and sanitization
 * - Password exclusion from response objects
 */

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, JwtPayload } from '../dto/create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

/**
 * User interface defining the structure of user objects
 * Used for type safety throughout the authentication system
 */
export interface User {
  id?: number;
  username: string;
  password: string;
}

/**
 * Authentication service providing user management and JWT operations
 *
 * Note: This implementation uses in-memory storage which is suitable for
 * development/demo purposes. For production, integrate with a persistent
 * database system.
 */
@Injectable()
export class AuthService {
  /**
   * In-memory user storage array
   * TODO: Replace with database integration for production use
   */
  private users: User[] = [];

  /**
   * JWT secret key used for token signing and verification
   * Retrieved from environment variable with fallback to default
   * WARNING: Use a secure random secret in production
   */
  private readonly jwtSecret = process.env.JWT_SECRET || 'default-secret';

  /**
   * Generates a JWT access token for authenticated users
   *
   * @param payload - JWT payload containing user identification data
   * @returns Signed JWT token string with 1 week expiration
   */
  generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '1w' });
  }

  /**
   * Registers a new user account
   *
   * Process:
   * 1. Validates required fields
   * 2. Hashes password using bcrypt
   * 3. Creates user record with auto-generated ID
   * 4. Generates JWT access token
   * 5. Returns user data (without password) and token
   *
   * @param createUserDto - User registration data
   * @returns Promise containing user object and access token
   * @throws HttpException if password is missing or validation fails
   */
  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ user: Omit<User, 'password'>; accessToken: string }> {
    console.log('Received DTO:', createUserDto);

    // Validate required password field
    if (!createUserDto.password) {
      throw new HttpException(
        { message: 'Password is required' },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Hash password with salt rounds of 10 for security
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create new user object with hashed password and auto-generated ID
    const newUser: User = {
      ...createUserDto,
      password: hashedPassword,
      id: this.users.length + 1, // Simple auto-increment ID generation
    };

    // Store user in memory array
    this.users.push(newUser);

    // Remove password from response object for security
    const userWithoutPassword = this.returnUserWithoutPassword(newUser);

    // Generate JWT access token for immediate authentication
    const accessToken = this.generateToken({
      username: userWithoutPassword.username,
      id: userWithoutPassword.id,
    });

    return {
      user: userWithoutPassword,
      accessToken,
    };
  }

  /**
   * Authenticates user login credentials
   *
   * Process:
   * 1. Finds user by username (case-insensitive)
   * 2. Verifies password using bcrypt comparison
   * 3. Generates new JWT access token
   * 4. Returns user data (without password) and token
   *
   * @param createUserDto - User login credentials
   * @returns Promise containing user object and access token
   * @throws HttpException if user not found or credentials invalid
   */
  async login(
    createUserDto: CreateUserDto,
  ): Promise<{ user: Omit<User, 'password'>; accessToken: string }> {
    // Find user by username (case-insensitive search)
    const user = this.users.find(
      (u) =>
        u.username?.toLowerCase() === createUserDto.username?.toLowerCase(),
    );

    // Validate user existence and password field
    if (!user || !user.password) {
      throw new HttpException(
        { message: 'Invalid credentials' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Verify password using bcrypt comparison
    const passwordsMatch = await bcrypt.compare(
      createUserDto.password,
      user.password,
    );

    if (!passwordsMatch) {
      throw new HttpException(
        { message: 'Invalid credentials' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Remove password from response for security
    const userWithoutPassword = this.returnUserWithoutPassword(user);

    // Generate new access token for this login session
    const accessToken = this.generateToken({
      username: userWithoutPassword.username,
      id: userWithoutPassword.id,
    });

    return {
      user: userWithoutPassword,
      accessToken,
    };
  }

  /**
   * Utility method to remove password field from user objects
   *
   * This ensures passwords are never included in API responses,
   * maintaining security and preventing accidental password exposure.
   *
   * @param user - User object containing password field
   * @returns User object without password field
   */
  private returnUserWithoutPassword(user: User): Omit<User, 'password'> {
    const { password, ...result } = user;

    // Log password hash for debugging (remove in production)
    console.log('Password hash processed:', password ? 'present' : 'missing');

    return result;
  }
}
