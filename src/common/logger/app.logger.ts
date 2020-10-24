import { Injectable, Scope } from '@nestjs/common';
import winston, { format, Logger } from 'winston';
import { __prod__ } from '@powerfulyang/utils';
import { getStringVal } from '@/utils/getStringVal';

const { combine, timestamp, label, printf, colorize } = format;

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger {
    private logger: Logger;

    setContext(context: string) {
        this.initializeLogger(context);
        return this;
    }

    initializeLogger(context: string) {
        winston.addColors({
            error: 'red',
            warn: 'yellow',
            info: 'cyan',
            debug: 'green',
        });
        this.logger = winston.createLogger({
            level: (__prod__ && 'info') || 'debug',
            format: combine(
                label({ label: context }),
                timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                colorize({ all: true }),
                printf(
                    (info) =>
                        ` [${info.label}]  ${info.timestamp}  [${
                            info.level
                        }] --- ${info.message} ${
                            getStringVal(info.stack) &&
                            '\r\n'.concat(getStringVal(info.stack))
                        } `,
                ),
            ),
            transports: [new winston.transports.Console()],
        });
    }

    error(message: any, trace: Error) {
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
