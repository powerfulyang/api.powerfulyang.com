import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch } from '@nestjs/common';
import { LoggerService } from '@/common/logger/logger.service';
import type { FastifyReply } from 'fastify';

@Catch()
export class CatchFilter<T> implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(CatchFilter.name);
  }

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const statusCode = 500;
    if (typeof exception === 'string') {
      this.logger.error(exception);
      response
        .status(statusCode)
        .headers({
          'x-error': exception,
        })
        .send({
          name: 'Error',
          message: exception,
        });
    } else {
      response.status(statusCode).send(exception);
    }
  }
}
