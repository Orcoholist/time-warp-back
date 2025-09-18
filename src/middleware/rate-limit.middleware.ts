/**
 * Rate Limiting Middleware
 *
 * Implements a simple in-memory rate limiting system to prevent abuse and
 * ensure fair API usage. Tracks requests per IP address and enforces
 * configurable limits within time windows.
 *
 * Features:
 * - IP-based request tracking
 * - Configurable rate limits and time windows
 * - Automatic request counter reset
 * - Standard HTTP 429 responses for rate limit violations
 *
 * Note: Uses in-memory storage which resets on server restart.
 * For production, consider Redis-based rate limiting.
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware for implementing API rate limiting
 *
 * Tracks request counts per IP address and enforces rate limits
 * to prevent abuse and ensure fair usage of API resources.
 */
@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  /**
   * In-memory map storing request counts per IP address
   * Key: IP address, Value: current request count in the time window
   */
  private requestMap = new Map<string, number>();

  /**
   * Middleware function that enforces rate limiting per IP address
   *
   * Algorithm:
   * 1. Extract client IP address from request
   * 2. Get current request count for this IP
   * 3. Check if limit has been exceeded
   * 4. If exceeded, return 429 Too Many Requests
   * 5. If within limit, increment counter and continue
   * 6. Set timeout to reset counter after time window
   *
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function to continue request pipeline
   */
  use(req: Request, res: Response, next: NextFunction) {
    // Extract client IP address with fallback for unknown IPs
    const ip = req.ip ?? 'unknown';

    // Rate limiting configuration
    const limit = 100; // Maximum requests per time window
    const windowMs = 60 * 1000; // Time window in milliseconds (1 minute)

    // Get current request count for this IP address
    const count = this.requestMap.get(ip) || 0;

    // Check if rate limit has been exceeded
    if (count >= limit) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    // Increment request count for this IP
    this.requestMap.set(ip, count + 1);

    // Schedule request counter reset after the time window
    setTimeout(() => this.requestMap.set(ip, 0), windowMs);

    // Continue to next middleware or route handler
    next();
  }
}
