import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import type { Response } from 'express';
import { map, tap } from 'rxjs/operators';
import { omit } from 'ramda';
import { isArray } from '@powerfulyang/utils';
import { LoggerService } from '@/common/logger/logger.service';
import { DefaultCookieOptions } from '@/constants/constants';

@Injectable()
export class CookieClearInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(CookieClearInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data) => {
        const cookieNames = data?.cookies as string[];
        if (isArray(cookieNames)) {
          const ctx = context.switchToHttp();
          const response = ctx.getResponse<Response>();
          cookieNames.forEach((cookieName) => {
            response.cookie(cookieName, '', { ...DefaultCookieOptions, maxAge: 0 });
          });
        } else {
          this.logger.warn('CookieClearInterceptor: No cookie to clear');
        }
      }),
      map((data) => omit(['cookies'])(data)),
    );
  }
}
