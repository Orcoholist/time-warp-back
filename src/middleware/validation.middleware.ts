// src/middleware/validation.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from 'src/dto/create-user.dto';

@Injectable()
export class ValidationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = plainToClass(CreateUserDto, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}
