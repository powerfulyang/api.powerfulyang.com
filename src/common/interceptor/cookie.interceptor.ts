import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import type { Response } from 'express';
import { map, tap } from 'rxjs/operators';
import { omit } from 'ramda';
import { isArray } from '@powerfulyang/utils';
import type { Cookie } from 'nodemailer/lib/fetch/cookies';
import { LoggerService } from '@/common/logger/logger.service';
import { CookieOptions } from '@/constants/constants';

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
            response.cookie(cookie.name, cookie.value, CookieOptions);
          });
        } else {
          this.logger.warn('No cookie found');
        }
      }),
      map((data) => omit(['cookie'])(data)),
    );
  }
}
