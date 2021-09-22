import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import type { Response } from 'express';
import { AppLogger } from '@/common/logger/app.logger';

@Injectable()
export class RedirectInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(RedirectInterceptor.name);
  }

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        this.logger.debug(`in ${RedirectInterceptor.name}`);
      }),
      tap((data) => {
        const ctx = _context.switchToHttp();
        const res = ctx.getResponse<Response>();
        if (data.redirect) {
          res.redirect(data.redirect);
        }
      }),
      map(() => null),
    );
  }
}
