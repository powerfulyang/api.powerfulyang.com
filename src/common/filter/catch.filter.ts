import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch } from '@nestjs/common';
import type { Request, Response } from 'express';
import { LoggerService } from '@/common/logger/logger.service';

@Catch()
export class CatchFilter<T extends Error> implements ExceptionFilter {
  constructor(private logger: LoggerService) {
    this.logger.setContext(CatchFilter.name);
  }

  catch(exception: T, host: ArgumentsHost) {
    this.logger.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = 500;
    const { message } = exception;
    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
