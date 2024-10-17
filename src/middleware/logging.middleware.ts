import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '../services/logger.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;

    // Store the original send method
    const originalSend = res.send.bind(res);

    // Override the res.send method to capture response data
    res.send = (body: any) => {
      // Log request details
      this.logger.logRequest(req);
    //   this.logger.log(`[${new Date().toISOString()}] ${method} ${originalUrl}`);

      // Log response details
      this.logger.logResponse({
        statusCode: res.statusCode,
        body: body,
      });

      // Call the original send method with the body
      return originalSend(body);
    };

    // Proceed to the next middleware
    next();
  }
}
