import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import type { Response } from 'express';
import { map, tap } from 'rxjs/operators';
import { omit } from 'ramda';
import { AppLogger } from '@/common/logger/app.logger';
import { CookieOptions } from '@/constants/constants';

@Injectable()
export class CookieInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(CookieInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        this.logger.debug(`in ${CookieInterceptor.name}`);
      }),
      tap((data) => {
        if (data.cookie) {
          const ctx = context.switchToHttp();
          const response = ctx.getResponse<Response>();
          response.cookie(data.cookie[0], data.cookie[1], CookieOptions);
        }
      }),
      map((data) => omit(['cookie'])(data)),
    );
  }
}
