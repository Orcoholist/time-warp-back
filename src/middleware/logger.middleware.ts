/**
 * Request Logger Middleware
 *
 * Logs incoming HTTP requests with timestamps, methods, URLs, response status codes,
 * and response times. Useful for debugging, monitoring, and performance analysis.
 *
 * Features:
 * - Request method and URL logging
 * - Response status code tracking
 * - Response time measurement
 * - ISO timestamp formatting
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware for logging HTTP requests and responses
 *
 * Automatically logs all incoming requests with detailed information
 * including timing metrics and response status codes.
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  /**
   * Middleware function that logs request and response information
   *
   * Logs:
   * - Incoming request: timestamp, HTTP method, and URL
   * - Outgoing response: status code and processing time
   *
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function to continue request pipeline
   */
  use(req: Request, res: Response, next: NextFunction) {
    // Log incoming request with timestamp, method, and URL
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

    // Record request start time for response time calculation
    const start = Date.now();

    // Set up event listener for when response is finished
    res.on('finish', () => {
      // Calculate and log response time and status code
      const responseTime = Date.now() - start;
      console.log(`Status: ${res.statusCode}, Time: ${responseTime}ms`);
    });

    // Continue to next middleware or route handler
    next();
  }
}
