import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from '@/common/logger/app.logger';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  constructor(private logger: AppLogger) {
    this.logger.setContext(HttpExceptionFilter.name);
  }

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    this.logger.error(exception);
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    // 出现错误 从cookie中删除_csrf  TODO 先简单处理
    response.removeHeader('set-cookie');
    response.status(statusCode).json({
      ...(exception.getResponse() as object),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
