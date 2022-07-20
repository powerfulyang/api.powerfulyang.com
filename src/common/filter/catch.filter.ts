import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch } from '@nestjs/common';
import { LoggerService } from '@/common/logger/logger.service';
import type { FastifyReply, FastifyRequest } from 'fastify';

@Catch()
export class CatchFilter<T extends Error> implements ExceptionFilter {
  constructor(private logger: LoggerService) {
    this.logger.setContext(CatchFilter.name);
  }

  catch(exception: T, host: ArgumentsHost) {
    this.logger.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const statusCode = 500;
    const { message } = exception;
    response.status(statusCode).send({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
