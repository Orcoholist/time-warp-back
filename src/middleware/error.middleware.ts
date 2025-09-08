// src/middleware/error.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    next(); // Продолжаем цепочку
  }
}
