import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response } from 'express';
import { map, tap } from 'rxjs/operators';
import { omit } from 'ramda';
import { AppLogger } from '@/common/logger/app.logger';

@Injectable()
export class CookieClearInterceptor implements NestInterceptor {
    constructor(private readonly logger: AppLogger) {
        this.logger.setContext(CookieClearInterceptor.name);
    }

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        return next.handle().pipe(
            tap(() => {
                this.logger.debug(
                    `in ${CookieClearInterceptor.name}`,
                );
            }),
            tap((data) => {
                if (data.cookie) {
                    const ctx = context.switchToHttp();
                    const response = ctx.getResponse<Response>();
                    response.clearCookie(data.cookie);
                }
            }),
            map((data) => omit(['cookie'])(data)),
        );
    }
}
