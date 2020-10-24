import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AppLogger } from '@/common/logger/app.logger';

@Catch()
export class CatchFilter<T extends Error> implements ExceptionFilter {
    constructor(private logger: AppLogger) {
        this.logger.setContext(CatchFilter.name);
    }

    catch(exception: T, host: ArgumentsHost) {
        this.logger.error('error', exception);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(500).json({
            statusCode: 500,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
