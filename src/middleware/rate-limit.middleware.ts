// src/middleware/rate-limit.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requestMap = new Map<string, number>();

  use(req: Request, res: Response, next: NextFunction) {
    // Используем fallback-значение 'unknown' если IP не определён
    const ip = req.ip ?? 'unknown';
    // const now = Date.now();
    const limit = 100; // 100 запросов в минуту
    const windowMs = 60 * 1000;

    const count = this.requestMap.get(ip) || 0;
    if (count >= limit) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    this.requestMap.set(ip, count + 1);
    setTimeout(() => this.requestMap.set(ip, 0), windowMs);
    next();
  }
}
