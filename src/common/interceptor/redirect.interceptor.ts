import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { map } from 'rxjs';
import { LoggerService } from '@/common/logger/logger.service';
import { isGraphQLContext } from '@/common/graphql/isGraphQLContext';

@Injectable()
export class RedirectInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(RedirectInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    if (isGraphQLContext(context)) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const res = ctx.getResponse<FastifyReply>();
        if (data?.redirect?.url) {
          const {
            type = 'HTTP',
            url,
            status = 302,
          } = data.redirect as { type?: string; url: string; status?: number };
          this.logger.info(`Redirecting to ${url}, type: ${type}, status: ${status}`);
          if (type === 'HTTP') {
            res.header('Location', url);
            res.status(status);
            return '';
          }
          if (type === 'JS') {
            res.header('Content-Type', 'text/html');
            return `<script>window.location.href = '${url}'</script>`;
          }
        }
        throw new Error('RedirectInterceptor: redirect is not defined');
      }),
    );
  }
}
