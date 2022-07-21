import { Injectable, Scope } from '@nestjs/common';
import type { Logger } from 'winston';
import winston, { format } from 'winston';
import { isProdProcess, isString } from '@powerfulyang/utils';
import chalk from 'chalk';

const { combine, timestamp, printf } = format;
const transport = new winston.transports.Console();
const packageName = process.env.npm_package_name || '';

const logger = winston.createLogger({
  level: (isProdProcess && 'info') || 'debug',
  transports: [transport],
  format: combine(
    timestamp({ format: 'MM/DD/YYYY, h:mm:ss A' }),
    printf(({ level, message, ...others }) => {
      const {
        context,
        stack,
        timestamp: t,
        ...json
      } = others as {
        context?: string;
        stack?: string;
        timestamp: string;
        [key: string]: any;
      };
      let write: chalk.Chalk;
      switch (level) {
        case 'info':
          write = chalk.green;
          break;
        case 'error':
          write = chalk.red;
          break;
        case 'debug':
          write = chalk.blue;
          break;
        case 'warn':
          write = chalk.yellow;
          break;
        case 'verbose':
          write = chalk.gray;
          break;
        default:
          write = chalk.cyan;
          break;
      }
      const LEVEL: string = write(level.toUpperCase());
      const MESSAGE: string = write(message);
      const CONTEXT = write(`[${context || ''}]`);
      const APP = write(`[${packageName}] ${process.pid}  -`);
      const STACK = stack ? chalk.magenta(`\n${stack}`) : '';
      const _JSON = Object.keys(json).length
        ? chalk.blueBright(`\n${JSON.stringify(json, undefined, 2)}`)
        : '';
      return `${APP} ${t}     ${LEVEL} ${CONTEXT} ${MESSAGE}${STACK}${_JSON}`;
    }),
  ),
});

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private readonly logger: Logger = logger;

  private context: string = 'LoggerService';

  setContext(context: string) {
    this.context = context;
  }

  error(message: string, stack?: Error, context?: string): void;
  error(error: Error): void;
  error(error: Error | string | Object, stack?: Error, context?: string) {
    if (error instanceof Error) {
      this.logger.error({
        ...error,
        context: context || this.context,
        stack: error.stack,
        message: error.message,
      });
    } else if (isString(error)) {
      this.logger.error({
        context: context || this.context,
        message: error,
        stack,
      });
    } else {
      // eslint-disable-next-line no-console
      console.log({ ...error });
    }
  }

  warn(message: string, context?: string) {
    this.logger.warn({ context: context || this.context, message });
  }

  info(message: string, context?: string) {
    this.logger.info({ context: context || this.context, message });
  }

  debug(message: string, context?: string) {
    this.logger.debug({ context: context || this.context, message });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose({ context: context || this.context, message });
  }

  log(message: string, context?: string) {
    this.logger.verbose({ context: context || this.context, message });
  }
}
