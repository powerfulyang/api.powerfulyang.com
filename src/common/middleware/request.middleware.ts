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
        const { headers, url } = req;
        this.logger.info(
            `request url => ${url}; request ip => ${headers?.['x-real-ip']}`,
        );
    }
}
