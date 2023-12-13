import { LoggerService } from '@/common/logger/logger.service';
import { RequestLogService } from '@/request-log/request-log.service';
import { getRequestId } from '@/request/namespace';
import { getIpInfo } from '@/utils/ipdb';
import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: LoggerService,
    private readonly requestLogService: RequestLogService,
  ) {
    this.logger.setContext(LogMiddleware.name);
  }

  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const xForwardedFor = req.headers['x-forwarded-for']?.toString() || '';

    const ip = xForwardedFor.split(',')[0];
    Reflect.defineMetadata('ip', ip, req);
    const userAgent = req.headers['user-agent'] || '';
    const { referer = '' } = req.headers;
    const requestId = getRequestId();

    // 此时还没有进入到路由
    next();
    // 此时已经进入到路由
    const { method = '', url: path = '' } = req;

    res.on('close', () => {
      const { statusCode } = res;
      const contentLength = (res.getHeader('content-length') as string) || '';
      const processTime = (res.getHeader('x-process-time') as string) || '';
      const ipInfo = getIpInfo(ip);

      this.logger.debug(
        `${method} ${path} ${statusCode} ${ip} "${ipInfo}" ${contentLength} ${processTime} ${referer} "${userAgent}"`,
      );

      this.requestLogService
        .log({
          ip,
          ipInfo,
          method,
          path,
          statusCode,
          contentLength,
          processTime,
          referer,
          userAgent,
          requestId,
        })
        .catch((err) => {
          this.logger.error(err);
        });
    });
  }
}
