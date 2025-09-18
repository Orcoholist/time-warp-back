/**
 * Root application module for Time Warp Backend
 *
 * This module serves as the main entry point for the NestJS application,
 * orchestrating all feature modules and configuring global middleware.
 *
 * Features:
 * - Authentication system integration
 * - Request logging and rate limiting
 * - Protected route configuration
 */

import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { RateLimitMiddleware } from './middleware/rate-limit.middleware';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './middleware/auth.middleware';

/**
 * Main application module that imports all feature modules
 * and configures application-wide middleware
 */
@Module({
  imports: [
    AuthModule, // Authentication and authorization functionality
  ],
})
export class AppModule {
  /**
   * Configures middleware for different routes
   *
   * Middleware chain:
   * 1. LoggerMiddleware - Logs all incoming requests
   * 2. RateLimitMiddleware - Applies rate limiting to prevent abuse
   * 3. AuthMiddleware - Protects specific routes requiring authentication
   *
   * @param consumer - NestJS middleware consumer for configuring middleware
   */
  configure(consumer: MiddlewareConsumer) {
    // Apply logging and rate limiting middleware to all routes
    consumer
      .apply(LoggerMiddleware, RateLimitMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    // Apply authentication middleware to protected routes
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'users', method: RequestMethod.ALL }, // User management endpoints
        { path: 'profile', method: RequestMethod.ALL }, // User profile endpoints
      );
  }
}
