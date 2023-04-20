import { LoggerService } from '@/common/logger/logger.service';
import { DefaultCookieOptions } from '@/constants/constants';
import type { CookieSerializeOptions } from '@fastify/cookie';
import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { isArray, isDevProcess } from '@powerfulyang/utils';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { omit } from 'ramda';
import type { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export type Cookie = {
  name: string;
  value: string;
  options?: CookieSerializeOptions;
};

export type CookieClear = {
  name: string;
  options?: CookieSerializeOptions;
};

/**
 * @description 如果是开发环境，不设置 domain
 * @supported 仅支持 powerfulyang.com 这种域名，不支持 powerfulyang.com.cn 这种
 */
export const getBaseDomain = (hostname: string) => {
  if (isDevProcess) {
    return undefined;
  }
  return hostname.split('.').slice(-2).join('.');
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
          const request = ctx.getRequest<FastifyRequest>();
          const domain = getBaseDomain(request.hostname);
          const reply = ctx.getResponse<FastifyReply>();
          cookies.forEach((cookie) => {
            reply.setCookie(
              cookie.name,
              cookie.value || '',
              cookie.options || {
                domain,
                ...DefaultCookieOptions,
              },
            );
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
