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
    const requestIp = headers?.['x-real-ip'] || ip;
    const ipInfo = findIpInfo(requestIp);
    let requestAddress = '';
    if (ipInfo.code === 0) {
      const { city_name, country_name, isp_domain, owner_domain, region_name } = ipInfo.data;
      const address = `${country_name}-${region_name}-${city_name} | ${owner_domain}-${isp_domain}`;
      requestAddress = address;
      this.logger.info(address);
    }
    Reflect.set(req, 'extend', { ip: requestIp, address: requestAddress });
    next();
    const { url } = req;
    const log = `request url => [${url}]; request ip => [${requestIp}]`;
    this.logger.info(log);
    this.telegramBotService.sendToMe(`${log} | ${requestAddress}`).catch((e) => {
      this.logger.error('telegram send error', e);
    });
  }
}
