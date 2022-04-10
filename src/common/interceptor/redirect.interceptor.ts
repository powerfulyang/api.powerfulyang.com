import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import type { Response } from 'express';
import { LoggerService } from '@/common/logger/logger.service';

@Injectable()
export class RedirectInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(RedirectInterceptor.name);
  }

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data) => {
        const ctx = _context.switchToHttp();
        const res = ctx.getResponse<Response>();
        if (data.redirect) {
          res.header('Location', data.redirect);
          res.status(data.status || 302);
          this.logger.info(`Redirecting to ${data.redirect}`);
        } else {
          throw new Error('RedirectInterceptor: redirect is not defined');
        }
      }),
      map(() => null),
    );
  }
}
