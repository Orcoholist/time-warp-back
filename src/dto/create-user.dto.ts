/**
 * Data Transfer Objects (DTOs) for User Authentication
 *
 * This file contains DTOs and interfaces used for user authentication
 * operations, including validation decorators and type definitions.
 */

import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO for user creation and authentication operations
 *
 * Used for both user registration and login requests.
 * Includes validation decorators to ensure data integrity
 * and provide meaningful error messages to clients.
 *
 * Validation Rules:
 * - username: Must be a non-empty string
 * - password: Must be a non-empty string
 *
 * @example
 * {
 *   "username": "john_doe",
 *   "password": "securePassword123"
 * }
 */
export class CreateUserDto {
  /**
   * User's chosen username
   *
   * Must be a non-empty string value.
   * Used for user identification and login purposes.
   */
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string = '';

  /**
   * User's password in plain text
   *
   * Must be a non-empty string value.
   * Will be hashed before storage for security purposes.
   * Consider adding additional validation for password strength in production.
   */
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string = '';
}

/**
 * JWT Payload interface defining the structure of JWT token claims
 *
 * Contains user identification information that will be encoded
 * in the JWT access token for authentication and authorization.
 *
 * @interface JwtPayload
 * @property username - User's username for identification
 * @property id - Optional user ID for additional identification
 */
export interface JwtPayload {
  /**
   * User's username
   * Required field for user identification in JWT tokens
   */
  username: string;

  /**
   * User's unique identifier
   * Optional field that can be used for additional user identification
   */
  id?: number;
}
