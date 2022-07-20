import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';
import { LoggerService } from '@/common/logger/logger.service';
import type { FastifyReply, FastifyRequest } from 'fastify';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  constructor(private logger: LoggerService) {
    this.logger.setContext(HttpExceptionFilter.name);
  }

  catch(exception: T, host: ArgumentsHost) {
    this.logger.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const statusCode = exception.getStatus();
    response.status(statusCode).send({
      statusCode,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
