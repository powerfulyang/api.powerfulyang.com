import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { LoggerService } from '@/common/logger/logger.service';
import { isGraphQLContext } from '@/common/graphql/isGraphQLContext';

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
    const reply = ctx.getResponse<FastifyReply>();
    const statusCode = 500;
    reply.status(statusCode).send(exception);
  }
}
