import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppLogger } from '@/common/logger/app.logger';

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
            map((data) => {
                if (data) {
                    this.logger.debug(
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
