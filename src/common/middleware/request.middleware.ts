import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from '@/common/logger/app.logger';
import { findIpInfo } from '@/utils/ipdb';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
    constructor(private logger: AppLogger) {
        this.logger.setContext(RequestMiddleware.name);
    }

    use(req: Request, _res: Response, next: () => void) {
        next();
        const { headers, url, ip } = req;
        const ipAddress = headers?.['x-real-ip'] || ip;
        this.logger.info(
            `request url => [${url}]; request ip => [${ipAddress}]`,
        );
        const ipInfo = findIpInfo(ip);
        if (ipInfo.code === 0) {
            const {
                city_name,
                country_name,
                isp_domain,
                owner_domain,
                region_name,
            } = ipInfo.data;
            this.logger.info(
                `${country_name}-${region_name}-${city_name} === ${owner_domain}-${isp_domain}`,
            );
        }
    }
}
