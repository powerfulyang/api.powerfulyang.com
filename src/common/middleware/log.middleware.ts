import { LoggerService } from '@/common/logger/logger.service';
import { RequestLogService } from '@/request-log/request-log.service';
import { getRequestId } from '@/request/namespace';
import { getIpInfo } from '@/utils/ipdb';
import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import process from 'node:process';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: LoggerService,
    private readonly requestLogService: RequestLogService,
  ) {
    this.logger.setContext(LogMiddleware.name);
  }

  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const xForwardedFor = req.headers['x-forwarded-for'] as string;

    const ip = (xForwardedFor || '').split(',')[0];
    Reflect.defineMetadata('ip', ip, req);
    const userAgent = req.headers['user-agent'] as string;
    const { referer = '' } = req.headers;

    // 此时还没有进入到路由
    next();
    // 此时已经进入到路由
    const { method, url: path } = req;

    res.on('close', () => {
      const { statusCode } = res;
      const contentLength = (res.getHeader('content-length') as string) || '';
      const processTime = (res.getHeader('x-process-time') as string) || '';
      const ipInfo = getIpInfo(ip);
      const requestId = getRequestId();

      this.logger.debug(
        `${method} ${path} ${statusCode} ${ip} "${ipInfo}" ${contentLength} ${processTime} ${referer} "${userAgent}"`,
      );

      process.nextTick(() => {
        this.requestLogService
          .log({
            ip,
            ipInfo,
            method: method!,
            path: path!,
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
    });
  }
}
