import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from '@/common/logger/app.logger';
import { findIpInfo } from '@/utils/ipdb';
import { TelegramBotService } from 'api/telegram-bot';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
    constructor(
        private logger: AppLogger,
        private telegramBotService: TelegramBotService,
    ) {
        this.logger.setContext(RequestMiddleware.name);
    }

    use(req: Request, _res: Response, next: () => void) {
        next();
        const { headers, url, ip } = req;
        const ipAddress = headers?.['x-real-ip'] || ip;
        const log = `request url => [${url}]; request ip => [${ipAddress}]`;
        this.logger.info(log);
        const ipInfo = findIpInfo(ipAddress);
        if (ipInfo.code === 0) {
            const {
                city_name,
                country_name,
                isp_domain,
                owner_domain,
                region_name,
            } = ipInfo.data;
            const ipLog = `${country_name}-${region_name}-${city_name} | ${owner_domain}-${isp_domain}`;
            this.logger.info(ipLog);
            this.telegramBotService
                .sendToMe(`${log} | ${ipLog}`)
                .catch((e) => {
                    this.logger.error('telegram send error', e);
                });
        }
    }
}
