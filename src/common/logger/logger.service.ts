import { Injectable, Scope } from '@nestjs/common';
import type { Logger } from 'winston';
import winston, { format } from 'winston';
import { isProdProcess } from '@powerfulyang/utils';
import chalk from 'chalk';

const { combine, timestamp, printf } = format;

const transport = new winston.transports.Console();

const logger = winston.createLogger({
  level: (isProdProcess && 'info') || 'debug',
  transports: [transport],
  format: combine(
    timestamp({ format: 'MM/DD/YYYY, h:mm:ss A' }),
    printf(({ level, message, timestamp: t, context, stack, ...others }) => {
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
      const LEVEL = write(level.toUpperCase());
      const MESSAGE = write(message);
      const CONTEXT = write(`[${context}]`);
      const APP = write(`[api.powerfulyang.com] ${process.pid}  -`);
      const STACK = stack ? chalk.magenta(`\n${stack}`) : '';
      const _JSON = Object.keys(others).length
        ? chalk.blueBright(`\n${JSON.stringify(others, undefined, 2)}`)
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

  error(error: Error, stack?: string, context?: string) {
    if (error.stack) {
      this.logger.error({
        ...error,
        context: context || this.context,
        stack: error.stack,
        message: error.message,
      });
    } else {
      this.logger.error({
        context: context || this.context,
        message: error,
        stack,
      });
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
