import { Injectable, LoggerService, Scope } from '@nestjs/common';
import winston, { format, Logger } from 'winston';
import { __prod__ } from '@powerfulyang/utils';

const { combine, timestamp, label, prettyPrint } = format;

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger implements LoggerService {
    private logger: Logger;

    setContext(context: string) {
        this.initializeLogger(context);
        return this;
    }

    initializeLogger(context: string) {
        this.logger = winston.createLogger({
            level: (__prod__ && 'info') || 'debug',
            format: combine(
                label({ label: context }),
                timestamp(),
                prettyPrint(),
            ),
            transports: [new winston.transports.Console()],
        });
    }

    error(message: any, trace: string) {
        this.logger.error(message, trace);
    }

    warn(message: any) {
        this.logger.warn(message);
    }

    info(message: any) {
        this.logger.info(message);
    }

    debug(message: any) {
        this.logger.debug(message);
    }

    log(message: any) {
        this.logger.log(message);
    }
}
