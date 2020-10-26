import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from '@/common/logger/app.logger';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
    constructor(private logger: AppLogger) {
        this.logger.setContext(RequestMiddleware.name);
    }

    use(req: Request, _res: Response, next: () => void) {
        next();
        const { ip, url } = req;
        this.logger.info(`ip [${ip}] request url [${url}]`);
    }
}
