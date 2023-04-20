import { isGraphQLContext } from '@/common/graphql/isGraphQLContext';
import { LoggerService } from '@/common/logger/logger.service';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch } from '@nestjs/common';
import type { FastifyReply } from 'fastify';

@Catch(Error)
export class ErrorFilter<T extends Error> implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(ErrorFilter.name);
  }

  catch(exception: T, host: ArgumentsHost) {
    this.logger.error(exception);

    if (isGraphQLContext(host)) {
      return;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const statusCode = 500;
    response.status(statusCode).send(exception);
  }
}
