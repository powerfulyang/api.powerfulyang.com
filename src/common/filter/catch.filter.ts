import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AppLogger } from '@/common/logger/app.logger';

@Catch()
export class CatchFilter<T extends HttpException>
    implements ExceptionFilter {
    constructor(private logger: AppLogger) {
        this.logger.setContext(CatchFilter.name);
    }

    catch(exception: T, host: ArgumentsHost) {
        this.logger.error('error', exception);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const statusCode = exception.getStatus() || 500;
        const { message } = exception;
        response.status(statusCode).json({
            statusCode,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
