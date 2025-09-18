/**
 * Authentication Middleware
 *
 * Protects routes by validating JWT tokens in the Authorization header.
 * Allows public routes (registration and login) to bypass authentication.
 *
 * Features:
 * - Public route exemption for auth endpoints
 * - Authorization header validation
 * - JWT token presence checking
 * - Standardized error responses
 *
 * TODO: Implement full JWT token validation and user context injection
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware for protecting routes with JWT authentication
 *
 * This middleware runs before protected route handlers and ensures
 * that requests contain valid authentication tokens. Public routes
 * are exempted from authentication requirements.
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  /**
   * Middleware function that validates authentication for protected routes
   *
   * Process:
   * 1. Check if the current route is in the public routes list
   * 2. If public, allow request to proceed without authentication
   * 3. If protected, check for Authorization header
   * 4. Validate token presence (full JWT validation not yet implemented)
   * 5. Allow request to proceed or return 401 error
   *
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function to continue request pipeline
   */
  use(req: Request, res: Response, next: NextFunction) {
    // Define routes that don't require authentication
    const publicRoutes = ['/auth/register', '/auth/login'];

    // Allow public routes to proceed without token validation
    if (publicRoutes.includes(req.url)) {
      return next(); // Allow without token validation
    }

    // Extract authorization token from request headers
    const token = req.headers.authorization;

    // Return error if no authorization token is provided
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // TODO: Implement full JWT token validation here
    // - Verify token signature
    // - Check token expiration
    // - Extract user information
    // - Attach user context to request object

    // For now, just check token presence and continue
    next();
  }
}
