import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { inspectIp } from '@/utils/ipdb';
import { LoggerService } from '@/common/logger/logger.service';

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
    const start = Date.now();
    Reflect.set(req, 'extend', { xRealIp, address, start });
    next();
    const { url } = req;
    this.logger.verbose(
      `requestUrl => [${url}]; xRealIp => [${xRealIp}] ; requestFrom => [${address}]`,
    );
  }
}
