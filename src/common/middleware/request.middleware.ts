import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@/common/logger/logger.service';
import { inspectIp } from '@/utils/ipdb';
import type { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(RequestMiddleware.name);
  }

  use(req: FastifyRequest, _res: FastifyReply, next: () => void) {
    // 此时还没有进路由
    const { headers } = req;
    const xRealIp = headers['x-real-ip'] as string;
    const ipInfo = inspectIp(xRealIp);
    let address = '';
    if (ipInfo.code === 0) {
      const { city_name, country_name, isp_domain, owner_domain, region_name } = ipInfo.data;
      address = `${country_name}-${region_name}-${city_name} | ${owner_domain}-${isp_domain}`;
    }
    Reflect.set(req, 'extend', { xRealIp, address });
    next();
    const { url } = req;
    this.logger.verbose(
      `requestUrl => [${url}]; xRealIp => [${xRealIp}] ; requestFrom => [${address}]`,
    );
  }
}
