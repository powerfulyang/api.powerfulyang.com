import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import type { Response } from 'express';
import { map, tap } from 'rxjs/operators';
import { omit } from 'ramda';
import { AppLogger } from '@/common/logger/app.logger';
import { CookieOptions } from '@/constants/constants';

@Injectable()
export class CookieClearInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(CookieClearInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        this.logger.debug(`in ${CookieClearInterceptor.name}`);
      }),
      tap((data) => {
        if (data.cookie) {
          const ctx = context.switchToHttp();
          const response = ctx.getResponse<Response>();
          response.cookie(data.cookie, '', { ...CookieOptions, maxAge: 0 });
        }
      }),
      map((data) => omit(['cookie'])(data)),
    );
  }
}
