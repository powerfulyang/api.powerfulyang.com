import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from '@/common/logger/app.logger';
import { findIpInfo } from '@/utils/ipdb';
import { TelegramBotService } from 'api/telegram-bot';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  constructor(private logger: AppLogger, private telegramBotService: TelegramBotService) {
    this.logger.setContext(RequestMiddleware.name);
  }

  use(req: Request, _res: Response, next: () => void) {
    // 此时还没有进路由
    const { headers, ip } = req;
    const xRealIp = headers?.['x-real-ip'] || ip;
    const ipInfo = findIpInfo(xRealIp);
    let address = '';
    if (ipInfo.code === 0) {
      const { city_name, country_name, isp_domain, owner_domain, region_name } = ipInfo.data;
      address = `${country_name}-${region_name}-${city_name} | ${owner_domain}-${isp_domain}`;
    }
    Reflect.set(req, 'extend', { ip, xRealIp, address });
    next();
    const { url } = req;
    const log = `request url => [${url}]; request ip => [${ip}]; xRealIp => [${xRealIp}] ; request address => [${address}]`;
    this.logger.info(log);
    this.telegramBotService.sendToMe(log).catch((e) => {
      this.logger.error('telegram send error', e);
    });
  }
}
