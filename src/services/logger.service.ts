import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

@Injectable()
export class Logger implements LoggerService {
  private logger: winston.Logger;

  constructor(private configService : ConfigService) {
    const logDir = this.configService.get<string>('WINSTON_LOG_DIR') || 'logs';

    const transport = new winston.transports.DailyRotateFile({
      filename: path.join(logDir, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    });

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [transport],
    });
  }

  sanitize(data: any): any {
    const sanitizedData = JSON.parse(JSON.stringify(data));

    // Example: Remove sensitive fields
    if (sanitizedData.password) {
      sanitizedData.password = '******';
    }

    return sanitizedData;
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string) {
    this.logger.error(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  logRequest(req: any) {
    const sanitizedRequest = this.sanitize(req.body);
    this.logger.info(`[${new Date().toISOString()}] method: ${req.method} originalUrl: ${req.originalUrl} Request: ${JSON.stringify(sanitizedRequest)}`);
  }

  logResponse(res: any) {
    const sanitizedResponse = this.sanitize(res);
    this.logger.info(`[${new Date().toISOString()}] Response: ${JSON.stringify(sanitizedResponse)}`);
  }
}
