import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import compression from 'compression';

@Injectable()
export class CompressionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    compression()(req, res, next);
  }
}
