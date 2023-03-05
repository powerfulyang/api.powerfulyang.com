import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch } from '@nestjs/common';
import { LoggerService } from '@/common/logger/logger.service';
import type { FastifyReply } from 'fastify';

@Catch(Error)
export class ErrorFilter<T extends Error> implements ExceptionFilter {
  constructor(private logger: LoggerService) {
    this.logger.setContext(ErrorFilter.name);
  }

  catch(exception: T, host: ArgumentsHost) {
    this.logger.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const statusCode = 500;
    const { name } = exception;
    response
      .status(statusCode)
      .headers({
        'x-error': name,
      })
      .send(exception);
  }
}