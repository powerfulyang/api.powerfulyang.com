import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';
import { LoggerService } from '@/common/logger/logger.service';
import type { FastifyReply } from 'fastify';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  constructor(private logger: LoggerService) {
    this.logger.setContext(HttpExceptionFilter.name);
  }

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const statusCode = exception.getStatus();
    this.logger.error(exception);
    response
      .status(statusCode)
      .headers({
        'x-error': exception.message || exception.name,
      })
      .send(exception.getResponse());
  }
}
