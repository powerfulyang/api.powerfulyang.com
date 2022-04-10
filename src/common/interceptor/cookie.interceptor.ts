import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import type { CookieOptions, Response } from 'express';
import { map, tap } from 'rxjs/operators';
import { omit } from 'ramda';
import { isArray } from '@powerfulyang/utils';
import { serialize } from 'cookie';
import { LoggerService } from '@/common/logger/logger.service';
import { DefaultCookieOptions } from '@/constants/constants';

export type Cookie = {
  name: string;
  value: string;
  options?: CookieOptions;
};

export type CookieClear = {
  name: string;
  options?: CookieOptions;
};

@Injectable()
export class CookieInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(CookieInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data) => {
        const cookies = data?.cookies as Cookie[];
        if (isArray(cookies)) {
          const ctx = context.switchToHttp();
          const response = ctx.getResponse<Response>();
          cookies.forEach((cookie) => {
            const c = serialize(
              cookie.name,
              cookie.value || '',
              cookie.options || DefaultCookieOptions,
            );
            response.header('Set-Cookie', c);
            if (cookie.options?.maxAge === 0) {
              this.logger.info(`Cookie ${cookie.name} cleared.`);
            } else {
              this.logger.info(`Cookie: ${cookie.name} set successfully.`);
            }
          });
        } else {
          this.logger.warn('CookieInterceptor: No cookies to set.');
        }
      }),
      map((data) => omit(['cookies'])(data)),
    );
  }
}
