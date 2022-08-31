import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import type { CookieSerializeOptions } from '@fastify/cookie';
import { map, tap } from 'rxjs/operators';
import { omit } from 'ramda';
import { isArray } from '@powerfulyang/utils';
import { LoggerService } from '@/common/logger/logger.service';
import { DefaultCookieOptions } from '@/constants/constants';
import type { FastifyReply } from 'fastify';

export type Cookie = {
  name: string;
  value: string;
  options?: CookieSerializeOptions;
};

export type CookieClear = {
  name: string;
  options?: CookieSerializeOptions;
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
          const reply = ctx.getResponse<FastifyReply>();
          cookies.forEach((cookie) => {
            reply.setCookie(cookie.name, cookie.value, cookie.options || DefaultCookieOptions);
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
