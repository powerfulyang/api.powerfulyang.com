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
                const ctx = _context.switchToHttp();
                const response = ctx.getResponse();
                const request = ctx.getRequest() as {
                    csrfToken: ReturnTypedFunction<string>;
                };
                this.logger.debug('generate csrf token!');
                response.cookie('_csrf_token', request.csrfToken());
            }),
            map((data) => {
                if (data) {
                    this.logger.info(
                        `response->${JSON.stringify(data)}`,
                    );
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
