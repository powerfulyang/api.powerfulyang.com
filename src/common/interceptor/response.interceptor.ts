import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppLogger } from '@/common/logger/app.logger';
import { ReturnTypedFunction } from '@powerfulyang/utils';
import { Response } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    constructor(private logger: AppLogger) {
        this.logger.setContext(ResponseInterceptor.name);
    }

    intercept(
        _context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        return next.handle().pipe(
            tap(() => {
                this.logger.debug(`in ${ResponseInterceptor.name}`);
            }),
            tap((data) => {
                if (data) {
                    const ctx = _context.switchToHttp();
                    const response = ctx.getResponse<Response>();
                    const request = ctx.getRequest() as {
                        csrfToken: ReturnTypedFunction<string>;
                    };
                    this.logger.debug('generate csrf token!');
                    response.cookie(
                        '_csrf_token',
                        request.csrfToken(),
                    );
                }
            }),
            map((data) => {
                if (data) {
                    return {
                        status: 'ok',
                        data,
                    };
                }
                return data;
            }),
        );
    }
}
