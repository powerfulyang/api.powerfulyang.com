import { requestNamespace, setRequestExtend, setRequestId } from '@/request/namespace';
import { generateUuid } from '@/utils/uuid';
import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { getIpInfo } from '@/utils/ipdb';
import { LoggerService } from '@/common/logger/logger.service';
import process from 'node:process';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(RequestMiddleware.name);
  }

  use(req: FastifyRequest, _res: FastifyReply, next: () => void) {
    // request log
    requestNamespace.run(() => {
      const requestId = generateUuid().toUpperCase();

      // 此时还没有进路由
      const { headers } = req;
      const xRealIp = headers['x-real-ip'] as string;
      const address = getIpInfo(xRealIp);
      const start = process.hrtime();
      setRequestId(requestId);
      setRequestExtend({ xRealIp, address, start });
      next();
    });
  }
}
