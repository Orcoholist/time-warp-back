// src/middleware/auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const publicRoutes = ['/auth/register', '/auth/login'];
    if (publicRoutes.includes(req.url)) {
      return next(); // Разрешаем без токена
    }

    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // Проверка токена (например, JWT)
    next();
  }
}
