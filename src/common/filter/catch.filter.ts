import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { LoggerService } from '@/common/logger/logger.service';
import { isGraphQLContext } from '@/common/graphql/isGraphQLContext';

@Catch()
export class CatchFilter<T> implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(CatchFilter.name);
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
