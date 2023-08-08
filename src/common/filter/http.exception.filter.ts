import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { LoggerService } from '@/common/logger/logger.service';
import { isGraphQLContext } from '@/common/graphql/isGraphQLContext';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  constructor(private logger: LoggerService) {
    this.logger.setContext(HttpExceptionFilter.name);
  }

  catch(exception: T, host: ArgumentsHost) {
    this.logger.error(exception);

    if (isGraphQLContext(host)) {
      return;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const statusCode = exception.getStatus();
    response.status(statusCode).send(exception.getResponse());
  }
}
