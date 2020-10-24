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

@Injectable()
export class CookieInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        return next.handle().pipe(
            tap((data) => {
                if (data.cookie) {
                    const ctx = context.switchToHttp();
                    const response = ctx.getResponse<Response>();
                    response.cookie(data.cookie[0], data.cookie[1]);
                }
            }),
            map((data) => omit(['cookie'])(data)),
        );
    }
}
