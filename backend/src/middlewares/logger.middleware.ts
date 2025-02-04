// 1. Middleware is a function that has access to the request and response objects.

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('1 - LoggerMiddleware');
    console.log('Request... ', req.method, req.originalUrl, ' Body:', req.body);
    next();
  }
}
