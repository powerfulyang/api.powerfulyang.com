import { LoggerService } from '@/common/logger/logger.service';
import { requestNamespace, setRequestId } from '@/request/namespace';
import { generateUuid } from '@/utils/uuid';
import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(RequestMiddleware.name);
  }

  use(req: FastifyRequest, _reply: FastifyReply, next: () => void) {
    // request log
    requestNamespace.run(() => {
      const requestIdFromHeader = req.headers['x-request-id'] as string | undefined;
      const requestId = requestIdFromHeader || generateUuid().toUpperCase();

      setRequestId(requestId);
      next();
    });
  }
}
