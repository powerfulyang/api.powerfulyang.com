import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';
import { TelegramBotService } from 'api/telegram-bot';
import { AppLogger } from '@/common/logger/app.logger';
import { inspectIp } from '@/utils/ipdb';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  constructor(private logger: AppLogger, private telegramBotService: TelegramBotService) {
    this.logger.setContext(RequestMiddleware.name);
  }

  use(req: Request, _res: Response, next: () => void) {
    // 此时还没有进路由
    const { headers } = req;
    const xRealIp = headers?.['x-real-ip'];
    const ipInfo = inspectIp(xRealIp);
    let address = '';
    if (ipInfo.code === 0) {
      const { city_name, country_name, isp_domain, owner_domain, region_name } = ipInfo.data;
      address = `${country_name}-${region_name}-${city_name} | ${owner_domain}-${isp_domain}`;
    }
    Reflect.set(req, 'extend', { xRealIp, address });
    next();
    const { url } = req;
    const log = `request url => [${url}]; xRealIp => [${xRealIp}] ; request address => [${address}]`;
    this.logger.info(log);
    this.telegramBotService.sendToMe(log).catch((e) => {
      this.logger.error('telegram send error', e);
    });
  }
}
