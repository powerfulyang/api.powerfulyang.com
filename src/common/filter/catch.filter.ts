import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch } from '@nestjs/common';
import { LoggerService } from '@/common/logger/logger.service';
import type { FastifyReply } from 'fastify';

@Catch()
export class CatchFilter<T extends Error> implements ExceptionFilter {
  constructor(private logger: LoggerService) {
    this.logger.setContext(CatchFilter.name);
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
